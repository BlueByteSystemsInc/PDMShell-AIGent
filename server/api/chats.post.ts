import { db, schema } from '../utils/db'
import { z } from 'zod'

const bodySchema = z.object({
  message: z.object({
    role: z.literal('user'),
    parts: z.array(z.record(z.string(), z.unknown())).min(1).max(50)
  }).passthrough()
})

export default defineEventHandler(async (event) => {
  const sessionId = getSessionId(event)

  const quota = checkQuota(sessionId)
  if (!quota.allowed) {
    throw createError({ statusCode: 429, statusMessage: quota.reason })
  }

  const body = await readBody(event)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    if (import.meta.dev) console.warn('[PDMShell] Validation error:', parsed.error.flatten())
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body'
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
