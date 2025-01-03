import { Injectable } from '@nestjs/common';
import { db } from 'src/db';
import { productsTable, categoryTable } from 'drizzle/drizzle.schemas';
import { desc, eq } from 'drizzle-orm';
import { CreateProductDto } from './dto/create-product.dto';
import { json } from 'drizzle-orm/mysql-core';
// import * as schema from 'drizzle/drizzle.schemas';
// import { drizzle } from 'drizzle-orm/mysql2';
// import  DrizzleConfig  from 'drizzle.config'; 

type ProductType = "consumable" | "non_consumable";

// function toProductType(value: string): ProductType | undefined {
//     if (value === "consumable" || value === "non_consumable") {
//         return value as ProductType;
//     }
//     return undefined; // Return undefined if the value is not valid
// }

@Injectable()
export class ProductsService { 

    async createProduct(product: CreateProductDto) {        

        type NewProduct = typeof productsTable.$inferInsert;

        // const productType = toProductType(product.type);
        const productType = product.type as ProductType;

        const produtInsert : NewProduct = {
            name: product.name,
            slug: product.slug,
            priceBase: product.priceBase,
            priceSell: product.priceSell,
            description: product.description ?? "",
            image: product.image,
            categoryId: product.categoryId ?? null,
            type: productType,
            stock: product.stock,
        }

        return await db.insert(productsTable).values(produtInsert)

    }

    async getAllProducts(page: number, limit: number) {        

        const offset = (page - 1) * limit;

        const products = await db.select({
            id: productsTable.id,
            name: productsTable.name,
            slug: productsTable.slug,
            priceBase: productsTable.priceBase,
            priceSell: productsTable.priceSell,
            // categoryName: categoryTable.name,
            // categorySlug: categoryTable.slug,s
            category: {
                name: categoryTable.name,
                slug: categoryTable.slug
            }
          }).from(productsTable).leftJoin(categoryTable, eq(productsTable.categoryId, categoryTable.id))
          .offset(offset)
          .limit(limit)
          .orderBy(desc(productsTable.id))

        const totalProduct = await db.$count(productsTable);

        // const products = await db.query.productsTable.findMany({
        //     with:{
        //         category:true
        //     },
        //     // limit,
        //     // offset,
        //     // orderBy: [desc(productsTable.id)]
        // })

        // console.log("products >>> ", products);
        

        return {
            data: products,
            pagination: {
                total: totalProduct,
                page,
                limit,
                totalPages: Math.ceil( (totalProduct) / limit )
            }
        }

        // return "coba coba"

        // const result = await db.query.
    }

    async getProductById(id: number) {

        // const db = drizzle({ schema });

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
