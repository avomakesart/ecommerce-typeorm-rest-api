import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '.';

@Entity()
export class Coupon extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  code!: string;

  @Column()
  description!: string;

  @Column()
  active!: boolean;

  @Column()
  value!: number;

  @Column()
  startDate!: Date;

  @Column()
  endDate!: Date;

  @Column()
  multiple!: boolean;

  @Column()
  creatorId: number;

  @ManyToOne(() => User, (user) => user.products)
  creator: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
