import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';
import { OrderService } from '../services';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  public getOrders = async (req: Request, res: Response) => {
    const orders = await this.orderService.index('buyer');
    res.json(orders);
  };

  public getMyOrders = async (
    req: Request & {
      session: Session & Partial<SessionData> & { userId?: number };
    },
    res: Response
  ) => {
    const buyerId = req.session.userId;
    const orders = await this.orderService.indexOwner(Number(buyerId));
    res.json(orders);
  };

  public getOrderById = async (req: Request, res: Response) => {
    const orderId = req['params'].id;
    const order = await this.orderService.indexById(Number(orderId), 'buyer');

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  };

  public addOrderItems = async (
    req: Request & {
      session: Session & Partial<SessionData> & { userId?: number };
    },
    res: Response
  ) => {
    const orderItems = req['body'];

    const userId = req.session.userId;

    console.log({ ...orderItems });

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items');
    } else {
      const order = await this.orderService.create(
        {
          ...orderItems,
        },
        Number(userId)
      );

      const createdOrder = await order.save();

      res.status(201).json({ ...createdOrder });
    }
  };

  public updateOrderToPaid = async (req: Request, res: Response) => {
    const order = await this.orderService.findToUpdatePaid(
      Number(req.params.id)
    );

    if (order) {
      order.isPaid = true;
      order.paidAt = new Date();

      const updatedOrder = await order.save();

      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  };

  public updateOrderToDelivered = async (req: Request, res: Response) => {
    const order = await this.orderService.findToUpdateDelivered(
      Number(req.params.id)
    );

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = new Date();

      const updatedOrder = await order.save();

      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  };
}
