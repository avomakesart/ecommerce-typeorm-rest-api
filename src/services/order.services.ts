import { getConnection } from 'typeorm';
import { Order } from '../entities';
import { OrderRepository } from '../repository';

export class OrderService {
  private orderRepository: OrderRepository;

  constructor() {
    this.orderRepository = getConnection().getCustomRepository(OrderRepository);
  }

  public index = async (user: any) => {
    const orders = await this.orderRepository.find({
      relations: [user],
    });
    return orders;
  };

  public indexOwner = async (buyerId: number) => {
    const orders = await this.orderRepository.find({ buyerId });
    return orders;
  };

  public create = async (order: Order, buyerId: number) => {
    const createOrder = await this.orderRepository.create({
      ...order,
      buyerId,
    });
    return createOrder;
  };

  public indexById = async (orderId: number, buyer: string) => {
    const order = await this.orderRepository.findOne(orderId, {
      relations: [buyer],
    });
    return order;
  };

  public findToUpdatePaid = async (orderId: number) => {
    const order = await this.orderRepository.findOne(orderId);
    return order;
  };

  public findToUpdateDelivered = async (orderId: number) => {
    const order = await this.orderRepository.findOne(orderId);
    return order;
  };
}
