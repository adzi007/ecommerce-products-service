import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { CategoryModule } from './category/category.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { 
  AuthGuard,
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard
} from 'nest-keycloak-connect';
import { KeycloakConfigService } from './config/keycloak-config.service';
import { ConfigModules } from './config/config.module';

@Module({
  imports: [
    ProductsModule, 
    CategoryModule,
    KeycloakConnectModule.registerAsync({
      useExisting: KeycloakConfigService,
      imports: [ConfigModules]
    })
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard, //By default, it will throw a 401 unauthorized when it is unable to verify the JWT token or Bearer header is missing.
    }, {
      provide: APP_GUARD,
      useClass: ResourceGuard, //Only controllers annotated with @Resource and methods with @Scopes are handled by this guard
    }, {
      provide: APP_GUARD,
      useClass: RoleGuard, //Permissive by default. Used by controller methods annotated with @Roles
    }
  ],
})
export class AppModule {}
