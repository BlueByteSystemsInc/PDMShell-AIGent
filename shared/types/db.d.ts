import type { chats, messages } from '../../server/db/schema'

export type Chat = typeof chats.$inferSelect
export type Message = typeof messages.$inferSelect
