import { db, schema } from 'hub:db'
import { and, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const sessionId = getSessionId(event)
  const { id } = getRouterParams(event)

  const chat = await db.query.chats.findFirst({
    where: () => and(
      eq(schema.chats.id, id as string),
      eq(schema.chats.sessionId, sessionId)
    )
  })

  if (!chat) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Chat not found'
    })
  }

  return await db.delete(schema.chats)
    .where(and(
      eq(schema.chats.id, id as string),
      eq(schema.chats.sessionId, sessionId)
    ))
    .returning()
})
