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

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY
})

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

  if (!chat.title) {
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

    await db.update(schema.chats).set({ title }).where(eq(schema.chats.id, id as string))
  }

  const lastMessage = messages[messages.length - 1]
  if (lastMessage?.role === 'user' && messages.length > 1) {
    await db.insert(schema.messages).values({
      chatId: id as string,
      role: 'user',
      parts: lastMessage.parts
    })
  }

  // Retrieve relevant PDMShell documentation for RAG
  const userQuery = messages.filter(m => m.role === 'user').map(m => {
    const textParts = (m.parts || []).filter((p: any) => p.type === 'text')
    return textParts.map((p: any) => p.text).join(' ')
  }).join(' ')

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
