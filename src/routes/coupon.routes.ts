import { Router } from 'express';
import { CouponController } from '../controllers';
import { admin } from '../middleware/authMiddleware';

export class CouponRoutes {
  public router: Router;
  public couponController: CouponController;

  constructor() {
    this.couponController = new CouponController();
    this.router = Router();
    this.routes();
  }

  /**
   * @desc Routes for product controller
   * @returns CRUD routes
   **/
  public routes() {
    this.router.get('/', this.couponController.getCoupons);
    this.router.post('/', admin, this.couponController.createCoupon);
    this.router.get('/:id', this.couponController.getCouponsById);
    this.router.put('/:id', admin, this.couponController.updateCoupon);
    this.router.delete('/:id', admin, this.couponController.deleteCoupon);
  }
}
