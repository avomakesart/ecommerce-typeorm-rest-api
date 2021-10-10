import { Router } from 'express';
import { OrderController } from '../controllers';
import { admin } from '../middleware/authMiddleware';

export class OrderRoutes {
  public router: Router;
  public orderController: OrderController;

  constructor() {
    this.orderController = new OrderController();
    this.router = Router();
    this.routes();
  }

  /**
   * @desc Routes for product controller
   * @returns CRUD routes
   **/
  public routes() {
    this.router.get('/', this.orderController.getOrders);
    this.router.post('/', admin, this.orderController.addOrderItems);
    this.router.get('/:id', this.orderController.getOrderById);
    this.router.get('/myorders', this.orderController.getMyOrders);
    this.router.get('/:id/pay', this.orderController.updateOrderToPaid);
    this.router.get(
      '/:id/deliver',
      admin,
      this.orderController.updateOrderToDelivered
    );
  }
}
