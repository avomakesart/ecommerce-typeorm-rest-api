import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem, ShippingAddress, User } from '.';

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (buyer) => buyer.orders)
  buyer: User;

  @Column()
  buyerId: number;

  @OneToMany(() => OrderItem, (orderItems) => orderItems.order, {
    cascade: true,
  })
  orderItems: OrderItem[];

  @ManyToOne(() => ShippingAddress, (shipAddress) => shipAddress.order)
  shippingAddress: ShippingAddress;

  @Column()
  shippingAddressId: number;

  @Column()
  paymentMethod!: string;

  @Column()
  taxPrice!: string;

  @Column()
  shippingPrice!: string;

  @Column()
  totalPrice!: string;

  @Column()
  isPaid!: boolean;

  @Column()
  paidAt!: Date;

  @Column()
  isDelivered!: boolean;

  @Column()
  deliveredAt!: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
