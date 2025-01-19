import { Inject, Injectable } from '@nestjs/common';
import { db } from 'src/db';
import { productsTable, categoryTable } from 'drizzle/drizzle.schemas';
import { desc, eq, inArray, sql } from 'drizzle-orm';
import { CreateProductDto } from './dto/create-product.dto';
// import { ValidateStockDto } from './dto/validate-stock.dto';
import { RedisService } from 'src/redis/redis.service';
import { OrderDto } from './dto/validate-stock.dto';
import { CartProductInfoDto } from './dto/cart-product-info.dto';

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
            // console.log("cachedData >>> ", cachedData);
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

    async validateStockProducts (orderRequests: OrderDto) {
        
        const lockKey = 'stock_update_lock'; 

        try {
            // 1. Acquire a distributed lock (e.g., using Redlock)
            
            const lockAcquired = await this.acquireLock(lockKey); 
      
            if (!lockAcquired) {
              throw new Error('Could not acquire lock. Please try again later.');
            }
      
            // 2. Check and update stock within the lock

            const productIds = orderRequests.productsOrderList.map((item) => item.id);

            // Fetch products from the database
            const products = await this.getProductsByIds(productIds);

            // Validate stock availability
            this.validateStock(orderRequests.productsOrderList, products);

            // Decrease stock using a transaction
            await this.decreaseProductStock(orderRequests.productsOrderList);          
      
            // 3. Release the lock
            await this.releaseLock(lockKey); 
      
            
      
        } catch (error) {
            // Release the lock in case of any error
            await this.releaseLock(lockKey); 
            throw error; 
        }

        return 'Stock updated successfully';
        
    }

    private async getProductsByIds(productIds: number[]): Promise<any[]> {
        try {
          const products = await db
            .select({ id: productsTable.id, stock: productsTable.stock })
            .from(productsTable)
            .where(inArray(productsTable.id, productIds));
      
          // Check for missing products
          const retrievedProductIds = products.map((product) => product.id);
          const missingProductIds = productIds.filter((id) => !retrievedProductIds.includes(id));
      
          if (missingProductIds.length > 0) {
            throw new Error(`Some products are missing from the database: ${missingProductIds.join(", ")}`);
          }
      
          return products;
        } catch (error) {
          console.error("Database query error:", error.message);
          throw new Error("Failed to retrieve products from the database. Please try again later.");
        }
    }

    private async decreaseProductStock(productsOrderList: { id: number; qty: number }[]): Promise<void> {
        await db.transaction(async (trx) => {
          try {
            for (const order of productsOrderList) {
              await trx
                .update(productsTable)
                .set({ stock: sql`${productsTable.stock} - ${order.qty}` })
                .where(eq(productsTable.id, order.id));
            }
          } catch (error) {
            console.error("Error updating stock in transaction:", error.message);
            throw new Error("Failed to update product stock. Transaction rolled back.");
          }
        });
    }

    // Function to validate stock availability
    private validateStock(orderRequest: { id: number; qty: number }[], productFromDb: { id: number; stock: number }[]): void {
        const errors: { status: number; id: number; availability: number; message: string }[] = [];

        for (const order of orderRequest) {
          const product = productFromDb.find(p => p.id === order.id);
          
          if (!product) {
            // throw new Error(`Product with ID ${order.id} not found in the database.`);
            errors.push({
                status: 404,
                id: order.id,
                availability: 0,
                message: `Product with ID ${order.id} not found in the database.`
            });
          }
      
          if (order.qty > product.stock) {
            // throw new Error(`Product with ID ${order.id} does not have enough stock. Requested: ${order.qty}, Available: ${product.stock}`);
            errors.push({
                status: 400,
                id: order.id,
                availability: product.stock,
                message: `Insufficient stock for product ID ${order.id}. Requested: ${order.qty}, Available: ${product.stock}`
            });
          }
        }

        if (errors.length > 0) {
            throw errors;
        }
    }

    private async acquireLock(lockKey: string, ttl = 2, retries = 3, retryDelay = 500): Promise<boolean> {
        let acquired = false;
        let attempt = 0;
      
        while (attempt < retries && !acquired) {
          const lockValue = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); 
          acquired = await this.redisService.setLock(lockKey, lockValue, ttl); 
      
          if (!acquired) {
            await new Promise(resolve => setTimeout(resolve, retryDelay)); // Wait before retrying
            attempt++;
          }
        }
        return acquired;
    }

    // Helper function to release a distributed lock

    private async releaseLock(lockKey: string): Promise<void> {
        const currentLockValue = await this.redisService.get(lockKey); 

        if (currentLockValue === await this.redisService.get(lockKey)) {
          await this.redisService.del(lockKey); 
        }
    }

    // private async releaseLock(lockKey: string): Promise<boolean> {
    //     const currentLockValue = await this.redisService.get(lockKey); 
    //     return await this.redisService.releaseLock(lockKey, currentLockValue); 
    // }

    async getCartProduct(cartProductInfo: CartProductInfoDto) { 
 
      const data = await db.select({ 
        id: productsTable.id, 
        name: productsTable.name,
        slug: productsTable.slug,
        price: productsTable.priceSell,
        stock: productsTable.stock,
        category: {
          name: categoryTable.name,
          slug: categoryTable.slug
        }
      
      }).from(productsTable)
      .leftJoin(categoryTable, eq(productsTable.categoryId, categoryTable.id))
      .where(inArray(productsTable.id, cartProductInfo.productsList))    


      return data


    }

}
