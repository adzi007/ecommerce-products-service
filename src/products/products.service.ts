import { Injectable } from '@nestjs/common';
import { db } from 'src/db';
import { productsTable } from 'drizzle/drizzle.schemas';
import { eq } from 'drizzle-orm';
import { CreateProductDto } from './dto/create-product.dto';

interface Prooo {
    name: string;
    slug: string;
    description: string;
    priceBase: number;
    priceSell: number;
    type: string;Placeholder
    image: string;
    stock: number;
    category_id: number;
}

type ProductType = "consumable" | "non_consumable";

function toProductType(value: string): ProductType | undefined {
    if (value === "consumable" || value === "non_consumable") {
        return value as ProductType;
    }
    return undefined; // Return undefined if the value is not valid
}

@Injectable()
export class ProductsService {

    

    async createProduct(product: CreateProductDto) {

        // console.log("product >>>> ", product);
        

        type NewProduct = typeof productsTable.$inferInsert;

        const productType = toProductType(product.type);

        const produtInsert : NewProduct = {
            name: product.name,
            slug: product.slug,
            priceBase: product.priceBase,
            priceSell: product.priceSell,
            description: product.description ?? "", // Handle nullable field
            image: product.image,
            categoryId: product.categoryId ?? null,
            type: productType,
            stock: product.stock,
        }

        return await db.insert(productsTable).values(produtInsert)

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
