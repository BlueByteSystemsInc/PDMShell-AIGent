CREATE TABLE `chats` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`session_id` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `chats_session_id_idx` ON `chats` (`session_id`);--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`chat_id` text NOT NULL,
	`role` text NOT NULL,
	`parts` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`chat_id`) REFERENCES `chats`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `messages_chat_id_idx` ON `messages` (`chat_id`);