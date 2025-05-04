import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { CategoryModule } from './category/category.module';
import { RedisModule } from './redis/redis.module';
// import { PrometheusModule } from './prometheus/prometheus.module';
import { PrometheusController } from './prometheus/prometheus.controller';
// import { MetricsMiddleware } from './common/middleware/metrics.middleware';
import { PrometheusService } from './prometheus/prometheus.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    RedisModule,
    ProductsModule, 
    CategoryModule,
    // PrometheusModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 15000, // 15 seconds
          limit: 10,
        },
      ],
    }),
  ],
  controllers: [PrometheusController],
  providers:[
    PrometheusService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
})
export class AppModule {}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(MetricsMiddleware).forRoutes('*');
//   }
// }
