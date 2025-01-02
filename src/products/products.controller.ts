import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {

    constructor(private readonly productsService: ProductsService) {}

    @Post()
    async createProduct(@Body() product: any) {

        // console.log("product >>> ", product);

        // return "test save product"
        
        // return this.productsService.createProduct(product);
        // return this.productsService.createProduct({ 
        //     name: product.name,
        //     slug: product.slug,
        //     description: product.description,
        //     price_base: product.price_base,
        //     price_sell: product.price_sell,
        //     type: product.type,
        //     image: product.image,
        //     stock: product.stock,
        //     category_id: product.category_id
        //  });
         
         return this.productsService.createProduct({ 
            name: "Indomie kari Original 240g",
            slug: "indomie-kari-original-240g",
            description: "lorem ipsum dolor sit amet",
            priceSell:  2200,
            priceBase:  2500,
            type: "consumable",
            image: "https://placehold.co/200",
            stock: 24,
            category_id: 1
         });
    }

    @Get()
    async getAllProducts() {
        return this.productsService.getAllProducts();
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
