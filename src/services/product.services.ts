import { getConnection } from 'typeorm';
import { Products } from '../entities';
import { ProductRepository } from '../repository';

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository =
      getConnection().getCustomRepository(ProductRepository);
  }

  public getProducts = async (options: any) => {
    const products = await this.productRepository.find(options);
    return products;
  };

  public getProductById = async (id: number) => {
    const product = await this.productRepository.findOne(id);
    return product;
  };

  public createProduct = async (product: Products, creatorId: number) => {
    const newProduct = await this.productRepository
      .create({ ...product, creatorId })
      .save();
    return newProduct;
  };

  public updateProduct = async (
    product: Products,
    id: number,
    creatorId: number
  ) => {
    const updatedProduct = await this.productRepository
      .createQueryBuilder()
      .update(Products)
      .set({ ...product })
      .where('id = :id  and "creatorId" = :creatorId', {
        id,
        creatorId,
      })
      .returning('*')
      .execute();

    return updatedProduct.raw[0];
  };

  public deleteProduct = async (id: number, creatorId: number) => {
    const deleteProduct = await this.productRepository.delete({
      id,
      creatorId,
    });
    return deleteProduct;
  };
}
