import { Router } from 'express';
import { CategoryController } from '../controllers';
import { admin } from '../middleware/authMiddleware';

export class CategoryRoutes {
  public router: Router;
  public categoryController: CategoryController;

  constructor() {
    this.categoryController = new CategoryController();
    this.router = Router();
    this.routes();
  }

  /**
   * @desc Routes for category controller
   * @returns CRUD routes
   **/
  public routes() {
    this.router.get('/', this.categoryController.getCategories);
    this.router.post('/', admin, this.categoryController.createCategory);
    this.router.get('/:id', this.categoryController.getCategoryById);
    this.router.put('/:id', admin, this.categoryController.updateCategory);
    this.router.delete('/:id', admin, this.categoryController.deleteCategory);
  }
}
