import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    async createCategory(@Body() category: any) {
        return this.categoryService.createCategory(category);
    }

    @Get()
    async getAllCategories() {
        return this.categoryService.getAllCategories();
    }

    @Get(":id")
    async getCategoryById(@Param("id") id: number) {
        return this.categoryService.getCategoryById(id);
    }

    @Put(":id")
    async updateCategory(@Param("id") id: number, @Body() updates: any) {
        return this.categoryService.updateCategory(id, updates);
    }

    @Delete(":id")
    async deleteCategory(@Param("id") id: number) {
        return this.categoryService.deleteCategory(id);
    }
}
