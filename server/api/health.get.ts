import { db, schema } from '../utils/db'

export default defineEventHandler(async () => {
  let dbStatus = 'connected'
  try {
    await db.query.chats.findFirst()
  } catch {
    dbStatus = 'error'
  }

  return {
    status: dbStatus === 'connected' ? 'ok' : 'degraded',
    db: dbStatus,
    timestamp: Date.now()
  }
})
