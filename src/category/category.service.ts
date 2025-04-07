import { Injectable } from '@nestjs/common';
import { db } from 'src/db';
import { categoryTable, productsTable } from 'drizzle/drizzle.schemas';
import { eq, sql } from 'drizzle-orm';
import { json } from 'drizzle-orm/mysql-core';

@Injectable()
export class CategoryService {
    async createCategory(category: any) {
        // return await db.insert(categoryTable).values(category).$returningId();
        // return await db.insert(categoryTable).values(category).$returningId();
        return await db.insert(categoryTable).values({
            name:category.name,
            slug:category.slug,
        }).$returningId();
    }

    async getAllCategories() {

        const category = await db.select({
            id: categoryTable.id,
            name: categoryTable.name,
            slug: categoryTable.slug
        }).from(categoryTable);


        // const category = await db.select({
        //     name: categoryTable.name,
        //     slug: categoryTable.slug,
        //     products: sql`
        //         (
        //         SELECT JSON_ARRAYAGG(
        //             JSON_OBJECT(
        //                 'name', ${productsTable.name},
        //                 'slug', ${productsTable.slug}
        //             )
        //         ) as proooS
        //         FROM products
        //         WHERE products.category_id = category.id
        //     )
        //     `.mapWith(va => JSON.parse(va))
        // }).from(categoryTable)        

        return category
    }

    async getCategoryById(id: number) {
        // return await db.select().from(categoryTable).where(categoryTable.id.eq(id));
        return await db.select().from(categoryTable).where(eq(categoryTable.id, id));
    }

    async updateCategory(id: number, updates: any) {
        return await db
            .update(categoryTable)
            .set(updates)
            .where(eq(categoryTable.id, id))
    }

    async deleteCategory(id: number) {
        return await db.delete(categoryTable).where(eq(categoryTable.id,id))
    }
}
