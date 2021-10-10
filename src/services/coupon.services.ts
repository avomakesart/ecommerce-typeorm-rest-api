import { getConnection } from 'typeorm';
import { Coupon } from '../entities';
import { CouponRepository } from '../repository';

export class CouponService {
  private couponRepository: CouponRepository;

  constructor() {
    this.couponRepository =
      getConnection().getCustomRepository(CouponRepository);
  }

  public index = async (options: any) => {
    const coupons = await this.couponRepository.find(options);
    return coupons;
  };

  public indexById = async (id: number) => {
    const coupon = await this.couponRepository.findOne(id);
    return coupon;
  };

  public create = async (coupon: Coupon, creatorId: number) => {
    const newCoupon = await this.couponRepository
      .create({
        ...coupon,
        creatorId,
      })
      .save();

    return newCoupon;
  };

  public update = async (coupon: Coupon, id: number, creatorId: number) => {
    const updateCoupon = await this.couponRepository
      .createQueryBuilder()
      .update(Coupon)
      .set({ ...coupon })
      .where('id = :id and "creatorId" = :creatorId', {
        id,
        creatorId,
      })
      .returning('*')
      .execute();

    return updateCoupon.raw[0];
  };

  public delete = async (id: number, creatorId: number) => {
    const deleteCoupon = await this.couponRepository.delete({ id, creatorId });
    return deleteCoupon;
  };
}
