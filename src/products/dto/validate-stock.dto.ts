import { IsInt } from "class-validator";


export class ValidateStockDto {
    @IsInt()
    id: number;
}