import { mysqlTable, int, varchar, timestamp, mysqlEnum, time } from "drizzle-orm/mysql-core";

// export const users = mysqlTable('users', {
//     id: int().primaryKey().autoincrement(),
//     name: varchar({ length: 255 }).notNull(),
//     age: int().notNull(),
//     email: varchar({ length: 255 }).notNull().unique(),
// });

export const categoryTable = mysqlTable("category", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
    deletedAt: time("deleted_at"),
});

export const productsTable = mysqlTable("products", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: varchar("description", { length: 1000 }).notNull(),
    priceBase: int("price_base").notNull(),
    priceSell: int("price_sell").notNull(),
    type: mysqlEnum("product_type", ['consumable', 'non_consumable']).notNull(),
    image: varchar("image", { length: 255 }).notNull(),
    stock: int("stock").notNull(),
    categoryId: int("category_id").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
    deletedAt: time("deleted_at"),
});

// export const productsXTable = mysqlTable("products", {
//     id: int("id").primaryK""ey().autoincrement(),
//     title: varchar("title", { length: 255 }).notNull(),
//     slug: varchar("slug", { length: 255 }).notNull(),
//     description: varchar("description", { length: 1000 }).notNull(),
//     priceBase: int("price_base").notNull(),
//     priceSell: int("price_sell").notNull(),
//     type: mysqlEnum("product_type", ['consumable', 'non_consumable']).notNull(),
//     image: varchar("image", { length: 255 }).notNull(),
//     stock: int("stock").notNull(),
//     categoryId: int("category_id").notNull(),
//     createdAt: timestamp("created_at").notNull().defaultNow(),
//     updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
//     // deletedAt: timestamp("deleted_at"),
// });