import { Router } from 'express';
import { ShippingAddressController } from '../controllers';

export class ShippingAddressRoutes {
  public router: Router;
  public shippingAddressController: ShippingAddressController;

  constructor() {
    this.shippingAddressController = new ShippingAddressController();
    this.router = Router();
    this.routes();
  }

  /**
   * @desc Routes for product controller
   * @returns CRUD routes
   **/
  public routes() {
    this.router.get('/', this.shippingAddressController.getShippingAddress);
    this.router.post('/', this.shippingAddressController.createShippingAddress);
    this.router.get('/:id', this.shippingAddressController.getShippingAddressById);
    this.router.put('/:id', this.shippingAddressController.updateShippingAddress);
    this.router.delete('/:id', this.shippingAddressController.deleteShippingAddress);
  }
}
