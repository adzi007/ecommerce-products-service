import { Transform, Type } from "class-transformer";
import { IsEnum } from "class-validator";
import { IsBoolean, IsDate, IsInt, IsOptional, IsString } from "class-validator";

enum ProductType {
    "consumable",
    "non_consumable",
}  

export class CreateProductDto {

    @IsString()
    name: string;

    @IsString()
    slug: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsInt()
    // @Transform(({ value }) => value, { toClassOnly: true })
    @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
    // @Transform(({ obj }) => obj.price_base, { toPlainOnly: true })
    priceBase: number;

    @IsInt()
    // @Transform(({ value }) => value, { toClassOnly: true })
    @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
    // @Transform(({ obj }) => obj.price_sell, { toPlainOnly: true })
    priceSell: number;

    @IsString()
    type: string;

    @IsString()
    image?: string;

    @IsInt()
    stock: number;

    @IsInt()
    @IsOptional()
    // @Transform(({ value }) => value, { toClassOnly: true })
    // @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
    // @Transform(({ obj }) => obj.category_id, { toPlainOnly: true })
    categoryId?: number;

}