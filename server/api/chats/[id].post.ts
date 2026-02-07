import { convertToModelMessages, createUIMessageStream, createUIMessageStreamResponse, generateText, smoothStream, streamText } from 'ai'
import { createGroq } from '@ai-sdk/groq'
import { z } from 'zod'
import { db, schema } from 'hub:db'
import { and, eq } from 'drizzle-orm'
import type { UIMessage } from 'ai'

defineRouteMeta({
  openAPI: {
    description: 'Chat with PDMShell AI Assistant.',
    tags: ['ai']
  }
})

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY environment variable is required. Set it in .env or your deployment dashboard.')
}

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY
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

  const { id } = await getValidatedRouterParams(event, z.object({
    id: z.string()
  }).parse)

  const { messages } = await readValidatedBody(event, z.object({
    messages: z.array(z.custom<UIMessage>())
  }).parse)

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

  // Generate title from first message (non-critical — wrapped in try-catch)
  if (!chat.title) {
    try {
      const { text: title } = await generateText({
        model: groq('llama-3.3-70b-versatile'),
        system: `You are a title generator for a chat:
          - Generate a short title based on the first user's message
          - The title should be less than 30 characters long
          - The title should be a summary of the user's message
          - Do not use quotes (' or ") or colons (:) or any other punctuation
          - Do not use markdown, just plain text`,
        prompt: JSON.stringify(messages[0])
      })

      await db.update(schema.chats).set({ title, updatedAt: new Date() }).where(eq(schema.chats.id, id as string))
    } catch (error) {
      console.error('[PDMShell] Title generation failed:', error)
      // Continue without title — the chat will show as "Untitled"
    }
  }

  const lastMessage = messages[messages.length - 1]
  if (lastMessage?.role === 'user' && messages.length > 1) {
    await db.insert(schema.messages).values({
      chatId: id as string,
      role: 'user',
      parts: lastMessage.parts
    })
  }

  // Update chat activity timestamp
  await db.update(schema.chats).set({ updatedAt: new Date() }).where(eq(schema.chats.id, id as string))

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
        model: groq('llama-3.3-70b-versatile'),
        system: systemPrompt,
        messages: await convertToModelMessages(messages),
        experimental_transform: smoothStream({ chunking: 'word' })
      })

      if (!chat.title) {
        writer.write({
          type: 'data-chat-title',
          data: { message: 'Generating title...' },
          transient: true
        })
      }

      writer.merge(result.toUIMessageStream())
    },
    onFinish: async ({ messages }) => {
      await db.insert(schema.messages).values(messages.map(message => ({
        chatId: chat.id,
        role: message.role as 'user' | 'assistant',
        parts: message.parts
      })))
    }
  })

  return createUIMessageStreamResponse({
    stream
  })
})
