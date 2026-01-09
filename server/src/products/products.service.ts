import { Injectable, BadGatewayException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const { categoryId, attributes, brandId, ...productData } =
      createProductDto;

    const brand = await this.prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      throw new BadGatewayException('Brand not found');
    }
    return this.prisma.product.create({
      data: {
        ...productData,
        brand: {
          connect: { id: brandId },
        },
        categories: {
          connect: categoryId.map((id) => ({ id })),
        },
        attributes: {
          create: attributes?.map((attr) => ({
            attributeValue: { connect: { id: attr.attributeId } },
          })),
        },
        // TODO:
      },
      include: {
        brand: true,
        categories: true,
        attributes: { include: { attributeValue: true } },
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: { brand: true, variants: true },
      take: 20,
    });
  }

  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        categories: true,
        attributes: { include: { attributeValue: true } },
        variants: true,
      },
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
