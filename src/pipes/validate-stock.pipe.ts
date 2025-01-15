import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateStockPipe implements PipeTransform {
  transform(value: any) {
    // Check if the value is an array
    if (!Array.isArray(value)) {
      throw new BadRequestException('Range must be an array.');
    }

    // Check if the array has exactly two numbers
    if (value.length !== 2 || !value.every((v) => typeof v === 'number')) {
      throw new BadRequestException('Range must contain exactly two numeric values.');
    }

    // Validate that the first value is less than or equal to the second
    const [min, max] = value;
    if (min > max) {
      throw new BadRequestException('Range must have a minimum value less than or equal to the maximum.');
    }

    return value; // Pass the validated range to the controller
  }
}
