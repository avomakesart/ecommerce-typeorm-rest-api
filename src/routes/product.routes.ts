import { Router } from 'express';
import { ProductController } from '../controllers';
import { admin } from '../middleware/authMiddleware';

export class ProductRoutes {
  public router: Router;
  public productController: ProductController;

  constructor() {
    this.productController = new ProductController();
    this.router = Router();
    this.routes();
  }

  /**
   * @desc Routes for product controller
   * @returns CRUD routes
   **/
  public routes() {
    this.router.get('/', this.productController.getProducts);
    this.router.post('/', admin, this.productController.createProduct);
    this.router.get('/:id', this.productController.getProductsById);
    this.router.put('/:id', admin, this.productController.updateProduct);
    this.router.delete('/:id', admin, this.productController.deleteProduct);
  }
}
