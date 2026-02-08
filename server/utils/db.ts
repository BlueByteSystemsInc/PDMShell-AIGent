import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../db/schema'

export { schema }

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null

function useDb() {
  if (!_db) {
    const url = process.env.DATABASE_URL
    if (!url) {
      throw new Error('DATABASE_URL environment variable is required.')
    }
    const client = postgres(url, { prepare: false })
    _db = drizzle(client, { schema })
  }
  return _db
}

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_, prop) {
    return (useDb() as any)[prop]
  }
})
