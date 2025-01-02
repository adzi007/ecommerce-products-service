import { mysqlTable, int, varchar, timestamp, mysqlEnum } from "drizzle-orm/mysql-core";

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
    deletedAt: timestamp("deleted_at"),
});

export const productsTable = mysqlTable("products", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: varchar("description", { length: 1000 }),
    priceBase: int("price_base"),
    priceSell: int("price_sell"),
    type: mysqlEnum("product_type", ['consumable', 'non_consumable']),
    image: varchar("image", { length: 255 }),
    stock: int("stock").notNull(),
    categoryId: int("category_id"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
    deletedAt: timestamp("deleted_at"),
});