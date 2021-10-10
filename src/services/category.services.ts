import { getConnection } from 'typeorm';
import { Category } from '../entities';
import { CategoryRepository } from '../repository';

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository =
      getConnection().getCustomRepository(CategoryRepository);
  }

  public index = async (options: any) => {
    const categories = await this.categoryRepository.find(options);
    return categories;
  };

  public indexById = async (id: number) => {
    const category = await this.categoryRepository.findOne(id);
    return category;
  };

  public create = async (category: Category, creatorId: number, ) => {
    const newCategory = await this.categoryRepository
      .create({
        ...category,
        creatorId,
      })
      .save();

    return newCategory;
  };

  public update = async (category: Category, id: number, creatorId: number) => {
    const updateCategory = await this.categoryRepository
      .createQueryBuilder()
      .update(Category)
      .set({ ...category })
      .where('id = :id and "creatorId" = :creatorId', {
        id,
        creatorId,
      })
      .returning('*')
      .execute();

    return updateCategory.raw[0];
  };

  public delete = async (id: number, creatorId: number) => {
    const deleteCategory = await this.categoryRepository.delete({
      id,
      creatorId,
    });
    return deleteCategory;
  };
}
