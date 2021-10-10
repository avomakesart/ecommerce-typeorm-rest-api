import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';
import { ShippingAddress } from '../entities';
import { ShippingAddressService } from '../services';

export class ShippingAddressController {
  private shippingAdressService: ShippingAddressService;

  constructor() {
    this.shippingAdressService = new ShippingAddressService();
  }

  public getShippingAddress = async (req: Request, res: Response) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
          code: req.query.keyword,
        }
      : {};

    console.log({ ...keyword });

    const count = await ShippingAddress.count();
    const coupons = await this.shippingAdressService.index({
      where: { ...keyword },
      take: pageSize,
      skip: pageSize * (page - 1),
    });

    res.json({ coupons, page, pages: Math.ceil(count / pageSize) });
  };

  public getShippingAddressById = async (req: Request, res: Response) => {
    const id = req['params'].id;

    const adress = await this.shippingAdressService.indexById(Number(id));

    if (adress) {
      res.send(adress).json();
    } else {
      res.status(400);
      throw new Error('Coupon not found');
    }
  };

  public createShippingAddress = async (
    req: Request & {
      session: Session & Partial<SessionData> & { userId?: number };
    },
    res: Response
  ) => {
    const address = req['body'] as ShippingAddress;
    const creatorId = req.session.userId;

    const newAddress = await this.shippingAdressService.create(
      address,
      Number(creatorId)
    );
    res.send(newAddress);
  };

  public updateShippingAddress = async (
    req: Request & {
      session: Session & Partial<SessionData> & { userId?: number };
    },
    res: Response
  ) => {
    const shippingAddress = req['body'] as ShippingAddress;
    const id = req['params']['id'];
    const creatorId = req.session.userId;

    const updateAddress = await this.shippingAdressService.update(
      shippingAddress,
      Number(id),
      Number(creatorId)
    );

    const shippingAddressExists = await this.shippingAdressService.indexById(
      Number(id)
    );

    if (shippingAddressExists) {
      res.send(updateAddress);
    } else {
      res.send(404);
      throw new Error('Coupon does not exist');
    }
  };

  public deleteShippingAddress = async (
    req: Request & {
      session: Session & Partial<SessionData> & { userId?: number };
    },
    res: Response
  ) => {
    const id = req['params']['id'];
    const creatorId = req.session.userId;
    const shippingAddress = await this.shippingAdressService.indexById(
      Number(id)
    );

    if (shippingAddress) {
      await this.shippingAdressService.delete(
        shippingAddress.id,
        Number(creatorId)
      );
      res.json({ message: 'Coupon removed' });
    } else {
      res.status(404);
      throw new Error('Coupon not found');
    }

    res.send();
  };
}
