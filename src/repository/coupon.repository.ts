import { EntityRepository, Repository } from 'typeorm';
import { Coupon } from '../entities';

@EntityRepository(Coupon)
export class CouponRepository extends Repository<Coupon> {}
