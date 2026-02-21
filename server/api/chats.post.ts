import { db, schema } from '../utils/db'
import { z } from 'zod'

const messageSchema = z.object({
  role: z.literal('user'),
  parts: z.array(z.record(z.unknown())).min(1)
}).passthrough()

export default defineEventHandler(async (event) => {
  const sessionId = getSessionId(event)
  const { message } = await readValidatedBody(event, z.object({
    message: messageSchema
  }).parse)

  const [chat] = await db.insert(schema.chats).values({
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
