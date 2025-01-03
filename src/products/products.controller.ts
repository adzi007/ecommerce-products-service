import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductPipe } from 'src/pipes/create-product.pipe';


@Controller('products')
export class ProductsController {

    constructor(private readonly productsService: ProductsService) {}

    @Post()
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
    async updateProduct(@Param("id") id: number, @Body() updates: any) {
        return this.productsService.updateProduct(id, updates);
    }

    @Delete(":id")
    async deleteProduct(@Param("id") id: number) {
        return this.productsService.deleteProduct(id);
    }
}
