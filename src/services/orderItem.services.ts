import { getConnection } from 'typeorm';
import { OrderItem } from '../entities';
import { OrderItemRepository } from '../repository';

export class OrderItemService {
  private orderRepository: OrderItemRepository;

  constructor() {
    this.orderRepository =
      getConnection().getCustomRepository(OrderItemRepository);
  }

  public index = async (options: any) => {
    const orderItems = await this.orderRepository.find(options);
    return orderItems;
  };

  public indexById = async (id: number) => {
    const orderItem = await this.orderRepository.findOne(id);
    return orderItem;
  };

  public create = async (items: OrderItem) => {
    const newOrderItem = this.orderRepository.create({ ...items });

    return newOrderItem;
  };

  public update = async (orderItems: OrderItem, id: number) => {
    const updateOrderItems = await this.orderRepository
      .createQueryBuilder()
      .update(OrderItem)
      .set({ ...orderItems })
      .where('id = :id', {
        id,
      })
      .returning('*')
      .execute();

    return updateOrderItems.raw[0];
  };

  public delete = async (id: number) => {
    const deleteOrderItem = await this.orderRepository.delete({ id });
    return deleteOrderItem;
  };
}
