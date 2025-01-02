import { Controller, Get } from '@nestjs/common';

@Controller('products')
export class ProductsController {

    @Get()
    async getUsers() {
        return "hello dari products controller"
    }
}
