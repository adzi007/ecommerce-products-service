import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductPipe } from 'src/pipes/create-product.pipe';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { OrderDto } from './dto/validate-stock.dto';


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

    @Post("/validate-order")
    async validateOrder(@Body() orderProducts: OrderDto){

        try {
            
            return await this.productsService.validateStockProducts(orderProducts);
            
        } catch (error) {            

            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
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
        const productById = await this.productsService.getProductById(id)
        return productById[0];
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
