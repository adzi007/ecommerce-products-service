import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductPipe } from 'src/pipes/create-product.pipe';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
// import { Public, RoleMatchingMode, Roles } from 'nest-keycloak-connect';


@Controller('products')
@UseGuards(AuthorizationGuard)
export class ProductsController {

    constructor(private readonly productsService: ProductsService) {}

    @Post()
    @Roles('admin') // Only accessible to admin users
    @UsePipes(CreateProductPipe)
    async createProduct(@Body(ValidationPipe) product: CreateProductDto) {
         return this.productsService.createProduct(product);
    }

    @Get()
    async getAllProducts(
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 10,
    ) {
        return this.productsService.getAllProducts(page, limit);
    }

    @Get(":id")
    async getProductById(@Param("id") id: number) {
        return this.productsService.getProductById(id);
    }

    @Put(":id")
    @Roles('admin') // Only accessible to admin users
    async updateProduct(@Param("id") id: number, @Body() updates: any) {
        return this.productsService.updateProduct(id, updates);
    }

    @Delete(":id")
    @Roles('admin') // Only accessible to admin users
    async deleteProduct(@Param("id") id: number) {
        return this.productsService.deleteProduct(id);
    }
}
