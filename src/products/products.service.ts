import { Injectable } from '@nestjs/common';
import { db } from 'src/db';
import { productsTable } from 'drizzle/drizzle.schemas';
import { eq } from 'drizzle-orm';

interface Prooo {
    name: string;
    slug: string;
    description: string;
    priceBase: number;
    priceSell: number;
    type: string;
    image: string;
    stock: number;
    category_id: number;
}
@Injectable()
export class ProductsService {

    

    async createProduct(product: Prooo) {
        return await db.insert(productsTable).values(product);
    }

    async getAllProducts() {
        return await db.select().from(productsTable);
    }

    async getProductById(id: number) {
        return await db.select().from(productsTable).where(eq(productsTable.id,id));
    }

    async updateProduct(id: number, updates: any) {
        return await db
            .update(productsTable)
            .set(updates)
            .where(eq(productsTable.id,id));
    }

    async deleteProduct(id: number) {
        return await db.delete(productsTable).where(eq(productsTable.id,id))
    }

}
