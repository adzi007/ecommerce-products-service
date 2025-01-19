import { Type } from "class-transformer";
import { IsArray, IsInt, IsNotEmpty, IsNumber, ValidateNested } from "class-validator";


class ProductIdsDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

}

export class CartProductInfoDto {
    // @IsArray()
    // @IsNotEmpty()
    // @Type(() => ProductIdsDto)
    // @ValidateNested()
    // productsList: ProductIdsDto[];



    @IsArray()
    @IsNotEmpty()
    productsList: number[];
}