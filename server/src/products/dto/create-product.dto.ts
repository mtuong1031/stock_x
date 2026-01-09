import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProductAttributeDto {
  @IsNumber()
  attributeId: number;
}

export class CreateProductDto {
  @IsNumber()
  @IsNotEmpty()
  tickerId: String;

  @IsString()
  @IsNotEmpty()
  name: String;

  @IsString()
  @IsOptional()
  description?: String;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsOptional()
  imageUrl?: String;

  @IsNumber()
  @IsNotEmpty()
  brandId: number;

  @IsNumber({}, { each: true })
  @IsArray()
  categoryId: number[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductAttributeDto)
  @IsOptional()
  attributes?: ProductAttributeDto[];
}
