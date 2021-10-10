import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order, Products } from '.';

@Entity()
export class OrderItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  quantity!: number;

  @Column()
  image!: string;

  @Column()
  price!: number;

  @ManyToOne(() => Order, (orders) => orders.orderItems, {
    onDelete: 'CASCADE',
  })
  order: Order;

  @Column()
  productId: number;

  @ManyToOne(() => Products, (products) => products.orderItem)
  product: Products;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
