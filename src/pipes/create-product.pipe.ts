import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class CreateProductPipe implements PipeTransform {
  transform(value: any) {
    const allowedFields = [
      'name',
      'slug',
      'description',
      'priceBase',
      'priceSell',
      'type',
      'image',
      'stock',
      'categoryId',
    ];

    const filteredData: Record<string, any> = Object.keys(value)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => ({ ...obj, [key]: value[key] }), {});

    // console.log("filteredData >>> ", filteredData);
    

    // Handle nullable fields
    if (filteredData.stock === undefined) {
      filteredData.stock = 0; // Set default stock to 0
    }

    if (filteredData.description === undefined) {
      filteredData.description = null; // Set default description to null
    }

    if (filteredData.image === undefined) {
      filteredData.image = null; // Set default image to null
    }

    if (filteredData.categoryId === undefined) {
      filteredData.categoryId = null; // Set default category ID to null
    }

    return filteredData;
  }
}
