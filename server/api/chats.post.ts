import { db, schema } from '../utils/db'
import { z } from 'zod'

const bodySchema = z.object({
  message: z.object({
    role: z.literal('user'),
    parts: z.array(z.record(z.string(), z.unknown())).min(1)
  }).passthrough()
})

export default defineEventHandler(async (event) => {
  const sessionId = getSessionId(event)

  const body = await readBody(event)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: parsed.error.flatten()
    })
  }
  const { message } = parsed.data

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
