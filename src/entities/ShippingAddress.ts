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
import { Order, User } from '.';

@Entity()
export class ShippingAddress extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  address!: string;

  @Column()
  city!: string;

  @Column()
  postalCode!: string;

  @Column()
  country!: string;

  @OneToMany(() => Order, (orders) => orders.shippingAddress)
  order: Order[];

  @Column()
  creatorId: number;

  @ManyToOne(() => User, (user) => user.shippingAddress)
  creator: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
