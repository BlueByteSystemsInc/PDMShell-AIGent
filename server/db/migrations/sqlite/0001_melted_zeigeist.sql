ALTER TABLE `chats` ADD `updated_at` integer NOT NULL DEFAULT (unixepoch());--> statement-breakpoint
CREATE INDEX `messages_chat_id_created_at_idx` ON `messages` (`chat_id`,`created_at`);