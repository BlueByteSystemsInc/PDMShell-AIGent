import { db, schema } from '../utils/db'
import { eq, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const sessionId = getSessionId(event)

  return await db.query.chats.findMany({
    where: () => eq(schema.chats.sessionId, sessionId),
    orderBy: () => desc(schema.chats.updatedAt)
  })
})
