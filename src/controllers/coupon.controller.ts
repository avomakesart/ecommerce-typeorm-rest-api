import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';
import { Coupon } from '../entities';
import { CouponService } from '../services';

export class CouponController {
  private couponService: CouponService;

  constructor() {
    this.couponService = new CouponService();
  }

  public getCoupons = async (req: Request, res: Response) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
          code: req.query.keyword,
        }
      : {};

    console.log({ ...keyword });

    const count = await Coupon.count();
    const coupons = await this.couponService.index({
      where: { ...keyword },
      take: pageSize,
      skip: pageSize * (page - 1),
    });

    res.json({ coupons, page, pages: Math.ceil(count / pageSize) });
  };

  public getCouponsById = async (req: Request, res: Response) => {
    const id = req['params'].id;

    const coupon = await this.couponService.indexById(Number(id));

    if (coupon) {
      res.send(coupon).json();
    } else {
      res.status(400);
      throw new Error('Coupon not found');
    }
  };

  public createCoupon = async (
    req: Request & {
      session: Session & Partial<SessionData> & { userId?: number };
    },
    res: Response
  ) => {
    const coupon = req['body'] as Coupon;
    const creatorId = req.session.userId;

    const newCoupon = await this.couponService.create(
      coupon,
      Number(creatorId)
    );
    res.send(newCoupon);
  };

  public updateCoupon = async (
    req: Request & {
      session: Session & Partial<SessionData> & { userId?: number };
    },
    res: Response
  ) => {
    const coupon = req['body'] as Coupon;
    const id = req['params']['id'];
    const creatorId = req.session.userId;

    const updateCoupon = await this.couponService.update(
      coupon,
      Number(id),
      Number(creatorId)
    );

    const couponExists = await this.couponService.indexById(Number(id));

    if (couponExists) {
      res.send(updateCoupon);
    } else {
      res.send(404);
      throw new Error('Coupon does not exist');
    }
  };

  public deleteCoupon = async (
    req: Request & {
      session: Session & Partial<SessionData> & { userId?: number };
    },
    res: Response
  ) => {
    const id = req['params']['id'];
    const creatorId = req.session.userId;
    const coupon = await this.couponService.indexById(Number(id));

    if (coupon) {
      await this.couponService.delete(coupon.id, Number(creatorId));
      res.json({ message: 'Coupon removed' });
    } else {
      res.status(404);
      throw new Error('Coupon not found');
    }

    res.send();
  };
}
