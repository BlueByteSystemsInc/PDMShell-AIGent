import { convertToModelMessages, createUIMessageStream, createUIMessageStreamResponse, generateText, smoothStream, streamText } from 'ai'
import { z } from 'zod'
import { db, schema } from '../../utils/db'
import { and, eq } from 'drizzle-orm'
import type { UIMessage } from 'ai'

defineRouteMeta({
  openAPI: {
    description: 'Chat with PDMShell AI Assistant.',
    tags: ['ai']
  }
})

/**
 * Extract text content from a message's parts.
 */
function getMessageText(message: UIMessage): string {
  return (message.parts || [])
    .filter((p): p is { type: 'text', text: string } => p.type === 'text')
    .map(p => p.text)
    .join(' ')
}

export default defineEventHandler(async (event) => {
  const sessionId = getSessionId(event)

  // Pre-flight rate limit check
  const quota = checkQuota(sessionId)
  if (!quota.allowed) {
    throw createError({ statusCode: 429, statusMessage: quota.reason })
  }

  const { id } = await getValidatedRouterParams(event, z.object({
    id: z.string().max(256)
  }).parse)

  const messageSchema = z.object({
    id: z.string().max(256),
    role: z.enum(['user', 'assistant', 'system']),
    parts: z.array(z.record(z.string(), z.unknown())).default([]).pipe(z.array(z.record(z.string(), z.unknown())).max(50))
  }).passthrough()

  const body = await readBody(event)
  const parsed = z.object({
    messages: z.array(messageSchema).max(200)
  }).safeParse(body)
  if (!parsed.success) {
    if (import.meta.dev) console.warn('[PDMShell] Validation error:', parsed.error.flatten())
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body'
    })
  }
  const { messages } = parsed.data as unknown as { messages: UIMessage[] }

  const chat = await db.query.chats.findFirst({
    where: () => and(
      eq(schema.chats.id, id as string),
      eq(schema.chats.sessionId, sessionId)
    ),
    with: {
      messages: true
    }
  })
  if (!chat) {
    throw createError({ statusCode: 404, statusMessage: 'Chat not found' })
  }

  // Start title generation in parallel — awaited later before notifying client
  let titlePromise: Promise<boolean> | null = null
  if (!chat.title) {
    titlePromise = generateText({
      model: getModel(),
      system: `You are a title generator for a chat:
          - Generate a short title based on the first user's message
          - The title should be less than 30 characters long
          - The title should be a summary of the user's message
          - Do not use quotes (' or ") or colons (:) or any other punctuation
          - Do not use markdown, just plain text`,
      prompt: JSON.stringify(messages[0])
    }).then(async (result) => {
      const { text: title, usage: titleUsage, response: titleResponse } = result
      recordRequest(sessionId, titleUsage.totalTokens)
      if (titleResponse.headers) {
        reconcileFromHeaders(titleResponse.headers)
      }
      await db.update(schema.chats).set({ title, updatedAt: new Date() }).where(eq(schema.chats.id, id as string))
      return true
    }).catch((error) => {
      console.error('[PDMShell] Title generation failed:', error)
      return false
    })
  }

  // Insert user message + update timestamp in parallel
  const dbOps: Promise<unknown>[] = [
    db.update(schema.chats).set({ updatedAt: new Date() }).where(eq(schema.chats.id, id as string))
  ]
  const lastMessage = messages[messages.length - 1]
  if (lastMessage?.role === 'user') {
    dbOps.push(db.insert(schema.messages).values({
      chatId: id as string,
      role: 'user',
      parts: lastMessage.parts ?? []
    }))
  }
  await Promise.all(dbOps)

  // Retrieve relevant PDMShell documentation for RAG
  // Use the last 3 user messages for context, weighted toward the most recent
  const userMessages = messages.filter(m => m.role === 'user')
  const recentUserMessages = userMessages.slice(-3)
  const userQuery = recentUserMessages
    .map((m, i) => {
      const text = getMessageText(m)
      // Weight the most recent message higher by repeating it
      return i === recentUserMessages.length - 1 ? `${text} ${text}` : text
    })
    .join(' ')

  const relevantDocs = await retrievePDMShellDocs(userQuery)

  const systemPrompt = buildPDMShellSystemPrompt(relevantDocs)

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const result = streamText({
        model: getModel(),
        system: systemPrompt,
        messages: await convertToModelMessages(messages),
        experimental_transform: smoothStream({ chunking: 'word' })
      })

      await writer.merge(result.toUIMessageStream())

      // Track usage after stream completes
      try {
        const usage = await result.usage
        recordRequest(sessionId, usage.totalTokens)

        const response = await result.response
        if (response.headers) {
          reconcileFromHeaders(response.headers)
        }
      } catch {
        // Usage tracking is non-critical
      }

      // Wait for title generation to finish, then notify client so sidebar refreshes
      if (titlePromise) {
        const titleSaved = await titlePromise
        if (titleSaved) {
          writer.write({
            type: 'data-chat-title',
            data: { message: 'Title generated' }
          })
        }
      }

      // Emit quota state to client
      writer.write({
        type: 'data-quota',
        data: getQuotaState(sessionId)
      })
    },
    onFinish: async ({ messages }) => {
      const validRoles = new Set(['user', 'assistant'])
      const toInsert = messages
        .filter(m => validRoles.has(m.role))
        .map(m => ({
          chatId: chat.id,
          role: m.role as 'user' | 'assistant',
          parts: m.parts ?? []
        }))
      if (toInsert.length) {
        await db.insert(schema.messages).values(toInsert)
      }
    }
  })

  return createUIMessageStreamResponse({
    stream
  })
})
