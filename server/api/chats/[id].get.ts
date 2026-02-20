import { z } from 'zod'
import { db, schema } from '../../utils/db'
import { and, eq, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const sessionId = getSessionId(event)

  const { id } = await getValidatedRouterParams(event, z.object({
    id: z.string()
  }).parse)

  const { limit } = await getValidatedQuery(event, z.object({
    limit: z.coerce.number().int().min(1).max(500).default(200)
  }).parse)

  const chat = await db.query.chats.findFirst({
    where: () => and(
      eq(schema.chats.id, id as string),
      eq(schema.chats.sessionId, sessionId)
    ),
    with: {
      messages: {
        orderBy: () => desc(schema.messages.createdAt),
        limit
      }
    }
  })

  if (!chat) {
    throw createError({ statusCode: 404, statusMessage: 'Chat not found' })
  }

  // Reverse so messages are in chronological order
  chat.messages.reverse()

  return chat
})
