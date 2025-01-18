import { Type } from "class-transformer";
import { IsArray, IsInt, IsNotEmpty, IsNumber, ValidateNested } from "class-validator";


// export class ValidateStockDto {
//     @IsInt()
//     id: number;
//     qty: number;
// }

class OrderItemDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;
  
    @IsNumber()
    @IsNotEmpty()
    qty: number;
  }
  
  export class OrderDto {
    @IsArray()
    @IsNotEmpty()
    @Type(() => OrderItemDto)
    @ValidateNested()
    productsOrderList: OrderItemDto[];
  }