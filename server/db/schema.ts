import { pgTable, text, timestamp, index, jsonb } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

const timestamps = {
  createdAt: timestamp('created_at').notNull().defaultNow()
}

export const chats = pgTable('chats', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title'),
  sessionId: text('session_id').notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ...timestamps
}, table => [
  index('chats_session_id_idx').on(table.sessionId)
])

export const chatsRelations = relations(chats, ({ many }) => ({
  messages: many(messages)
}))

export const messages = pgTable('messages', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  chatId: text('chat_id').notNull().references(() => chats.id, { onDelete: 'cascade' }),
  role: text('role', { enum: ['user', 'assistant', 'system'] }).notNull(),
  parts: jsonb('parts'),
  ...timestamps
}, table => [
  index('messages_chat_id_idx').on(table.chatId),
  index('messages_chat_id_created_at_idx').on(table.chatId, table.createdAt)
])

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id]
  })
}))
