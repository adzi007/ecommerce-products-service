import { Injectable } from '@nestjs/common';
import { db } from 'src/db';
import { categoryTable } from 'drizzle/drizzle.schemas';
import { eq } from 'drizzle-orm';

@Injectable()
export class CategoryService {
    async createCategory(category: any) {
        return await db.insert(categoryTable).values(category).$returningId();
    }

    async getAllCategories() {
        return await db.select().from(categoryTable);
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
