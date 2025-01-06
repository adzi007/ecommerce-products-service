import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductPipe } from 'src/pipes/create-product.pipe';
import { Public, RoleMatchingMode, Roles } from 'nest-keycloak-connect';


@Controller('products')
export class ProductsController {

    constructor(private readonly productsService: ProductsService) {}

    @Post()
    @Roles({roles:['admin'], mode: RoleMatchingMode.ALL})
    @UsePipes(CreateProductPipe)
    async createProduct(@Body(ValidationPipe) product: CreateProductDto) {
         return this.productsService.createProduct(product);
    }

    @Get()
    @Public()
    async getAllProducts(
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 10,
    ) {
        return this.productsService.getAllProducts(page, limit);
    }

    @Get(":id")
    @Public()
    async getProductById(@Param("id") id: number) {
        return this.productsService.getProductById(id);
    }

    @Put(":id")
    @Roles({roles:['admin']})
    async updateProduct(@Param("id") id: number, @Body() updates: any) {
        return this.productsService.updateProduct(id, updates);
    }

    @Delete(":id")
    @Roles({roles:['admin']})
    async deleteProduct(@Param("id") id: number) {
        return this.productsService.deleteProduct(id);
    }
}
