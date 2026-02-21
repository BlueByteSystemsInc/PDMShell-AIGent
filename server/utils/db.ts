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
    const client = postgres(url, {
      prepare: false,
      max: 20,
      idle_timeout: 30,
      max_lifetime: 60 * 30
    })
    _db = drizzle(client, { schema })
  }
  return _db
}

type DbInstance = ReturnType<typeof drizzle<typeof schema>>

export const db = new Proxy({} as DbInstance, {
  get(_, prop: string | symbol) {
    return (useDb() as Record<string | symbol, unknown>)[prop]
  }
})
