import { relations, sql } from "drizzle-orm";
import { mysqlTable, int, varchar, timestamp, mysqlEnum, time } from "drizzle-orm/mysql-core";

export const categoryTable = mysqlTable("category", {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
    // deletedAt: time("deleted_at"),
    deletedAt: timestamp("deleted_at").default(sql`null`).$type<Date | null>()

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
    // deletedAt: time("deleted_at"),
    deletedAt: time("deleted_at").default(sql`null`).$type<Date | null>()
});

export const productsTableRelation = relations(categoryTable, ({ one }) => ({
    category: one(productsTable, { fields: [categoryTable.id], references: [productsTable.categoryId] }),
    // comments: many(categoryTable),
}));

export const categoryTableRelation = relations(productsTable, ({ one, many }) => ({
    category: one(categoryTable, { fields: [productsTable.categoryId], references: [categoryTable.id] }),
    products: many(productsTable),
}));