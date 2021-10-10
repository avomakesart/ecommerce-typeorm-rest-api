import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';
import { CategoryService } from '../services';
import { CategoryRepository } from '../repository/category.repository';
import { Category } from '../entities';

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  public getCategories = async (req: Request, res: Response) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
          code: req.query.keyword,
        }
      : {};

    console.log({ ...keyword });

    const count = await Category.count();
    const categories = await this.categoryService.index({
      where: { ...keyword },
      take: pageSize,
      skip: pageSize * (page - 1),
    });

    res.json({ categories, page, pages: Math.ceil(count / pageSize) });
  };

  public getCategoryById = async (req: Request, res: Response) => {
    const id = req['params'].id;

    const category = await this.categoryService.indexById(Number(id));

    if (category) {
      res.send(category).json();
    } else {
      res.status(400);
      throw new Error('Category not found');
    }
  };

  public createCategory = async (
    req: Request & {
      session: Session & Partial<SessionData> & { userId?: number };
    },
    res: Response
  ) => {
    const category = req['body'] as Category;
    const creatorId = req.session.userId;

    const newCategory = await this.categoryService.create(
      category,
      Number(creatorId)
    );
    res.send(newCategory);
  };

  public updateCategory = async (
    req: Request & {
      session: Session & Partial<SessionData> & { userId?: number };
    },
    res: Response
  ) => {
    const category = req['body'] as Category;
    const id = req['params']['id'];
    const creatorId = req.session.userId;

    const updateCategory = await this.categoryService.update(
      category,
      Number(id),
      Number(creatorId)
    );

    const categoryExists = await this.categoryService.indexById(Number(id));

    if (categoryExists) {
      res.status(201).json({ ...updateCategory });
    } else {
      res.send(404);
      throw new Error('Category does not exist');
    }
  };

  public deleteCategory = async (
    req: Request & {
      session: Session & Partial<SessionData> & { userId?: number };
    },
    res: Response
  ) => {
    const id = req['params']['id'];
    const creatorId = req.session.userId;
    const category = await this.categoryService.indexById(Number(id));

    if (category) {
      await this.categoryService.delete(category.id, Number(creatorId));
      res.json({ message: 'Category removed' });
    } else {
      res.status(404);
      throw new Error('Category not found');
    }

    res.status(201).json('The category has been deleted correctly');
  };
}
