import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { CategoryModule } from './category/category.module';
import { RedisModule } from './redis/redis.module';
// import { PrometheusModule } from './prometheus/prometheus.module';
import { PrometheusController } from './prometheus/prometheus.controller';
import { MetricsMiddleware } from './common/middleware/metrics.middleware';
import { PrometheusService } from './prometheus/prometheus.service';

@Module({
  imports: [
    RedisModule,
    ProductsModule, 
    CategoryModule,
    // PrometheusModule,
  ],
  controllers: [PrometheusController],
  providers:[PrometheusService],
})
export class AppModule {}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(MetricsMiddleware).forRoutes('*');
//   }
// }
