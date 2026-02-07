import type { UIMessage } from 'ai'
import { db, schema } from 'hub:db'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const sessionId = getSessionId(event)
  const { id, message } = await readValidatedBody(event, z.object({
    id: z.string(),
    message: z.custom<UIMessage>()
  }).parse)

  const [chat] = await db.insert(schema.chats).values({
    id,
    title: '',
    sessionId
  }).returning()

  if (!chat) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create chat' })
  }

  await db.insert(schema.messages).values({
    chatId: chat.id,
    role: 'user',
    parts: message.parts
  })

  return chat
})
