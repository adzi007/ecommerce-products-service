import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { CategoryModule } from './category/category.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    RedisModule,
    ProductsModule, 
    CategoryModule,
  ],
  controllers: [],
  providers:[],
})
export class AppModule {}
