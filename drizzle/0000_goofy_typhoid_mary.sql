CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` varchar(1000),
	`price_base` int NOT NULL DEFAULT 0,
	`price_sell` int NOT NULL DEFAULT 0,
	`product_type` enum('consumable','non_consumable'),
	`image` varchar(255),
	`stock` int NOT NULL,
	`category_id` int,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
