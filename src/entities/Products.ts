import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem, Category, User, Images } from '.';

@Entity()
export class Products extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  color!: string;

  @ManyToMany((type) => Category, (category) => category.products, {
    cascade: true,
  })
  @JoinTable()
  categories: Category[];

  @Column()
  price!: string;

  @Column()
  featuredImage!: string;

  @OneToMany((type) => Images, (images) => images.product, {
    cascade: true,
  })
  images: Images[];

  @Column()
  brand!: string;

  @Column()
  size!: string;

  @Column()
  sku!: string;

  @Column()
  description!: string;

  @Column()
  countInStock!: number;

  @Column()
  creatorId: number;

  @ManyToOne(() => User, (user) => user.products)
  creator: User;

  // @ManyToMany((type) => OrderItem, (orderItem) => orderItem.products, {
  //   cascade: true,
  // })
  // @JoinTable()
  // orderItem: OrderItem[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItem: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
