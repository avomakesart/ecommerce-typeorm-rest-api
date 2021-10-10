import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order, Products, ShippingAddress, Category } from '.';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ default: 'User' })
  role!: string;

  @Column({ type: 'text' })
  pictureUrl: string;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @OneToMany(() => Order, (orders) => orders.buyer)
  orders: Order[];

  @OneToMany(() => Products, (product) => product.creator)
  products: Products[];

  @OneToMany(() => Category, (product) => product.creator)
  categories: Category[];

  @OneToMany(() => ShippingAddress, (product) => product.creator)
  shippingAddress: ShippingAddress[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
