import { Inject, Injectable } from '@nestjs/common';
import { db } from 'src/db';
import { productsTable, categoryTable } from 'drizzle/drizzle.schemas';
import { desc, eq } from 'drizzle-orm';
import { CreateProductDto } from './dto/create-product.dto';
import { ValidateStockDto } from './dto/validate-stock.dto';
import { RedisService } from 'src/redis/redis.service';

type ProductType = "consumable" | "non_consumable";

@Injectable()
export class ProductsService { 

    // constructor(private readonly redisService: RedisService) {}
    constructor(
        @Inject(RedisService) 
        private readonly redisService: RedisService 
      ) {}

    async createProduct(product: CreateProductDto) {        

        type NewProduct = typeof productsTable.$inferInsert;

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

        // return "test protexted route"

    }

    async getAllProducts(page: number, limit: number) {        

        const offset = (page - 1) * limit;

        const products = await db.select({
            id: productsTable.id,
            name: productsTable.name,
            slug: productsTable.slug,
            priceBase: productsTable.priceBase,
            priceSell: productsTable.priceSell,
            category: {
                name: categoryTable.name,
                slug: categoryTable.slug
            }
          }).from(productsTable).leftJoin(categoryTable, eq(productsTable.categoryId, categoryTable.id))
          .offset(offset)
          .limit(limit)
          .orderBy(desc(productsTable.id))

        const totalProduct = await db.$count(productsTable);    

        return {
            data: products,
            pagination: {
                total: totalProduct,
                page,
                limit,
                totalPages: Math.ceil( (totalProduct) / limit )
            }
        }
    }

    async getProductById(id: number) {

        const cachedData = await this.redisService.get('product-detail-'+id);

        if (cachedData) {
            // console.log('Data retrieved from Redis');
            return cachedData;
        }

        const data = await db.select({
            id: productsTable.id,
            name: productsTable.name,
            slug: productsTable.slug,
            description: productsTable.description,
            priceBase: productsTable.priceBase,
            priceSell: productsTable.priceSell,
            type: productsTable.type,
            image: productsTable.image,
            stock: productsTable.stock,
            category: {
                name: categoryTable.name,
                slug: categoryTable.slug
            }
        }).from(productsTable).leftJoin(categoryTable, eq(productsTable.categoryId, categoryTable.id)).where(eq(productsTable.id,id));

        await this.redisService.set('product-detail-'+id, data, 60);

        return data;

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

    async validateStockProducts (productIds: number[]) {

        console.log("productIds service >>> ", productIds);
        

    }

    // Helper function to acquire a distributed lock using Redlock
    private async acquireLock(lockKey: string, ttl = 10000): Promise<boolean> {
        const lockValue = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); 
        const acquired = await this.redisService.set(lockKey, lockValue, ttl); 
      
        return acquired; // Use the returned boolean value
      }

    // Helper function to release a distributed lock
    private async releaseLock(lockKey: string): Promise<void> {
        const currentLockValue = await this.redisService.get(lockKey); 
        if (currentLockValue === await this.redisService.get(lockKey)) {
        await this.redisService.del(lockKey); 
        }
    }

}
