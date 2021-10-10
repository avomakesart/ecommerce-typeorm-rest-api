import { getConnection } from 'typeorm';
import { ShippingAddress } from '../entities';
import { ShippingAddressRepository } from '../repository';

export class ShippingAddressService {
  private shippingAddressRepository: ShippingAddressRepository;

  constructor() {
    this.shippingAddressRepository = getConnection().getCustomRepository(
      ShippingAddressRepository
    );
  }

  public index = async (options: any) => {
    const shipAddress = await this.shippingAddressRepository.find(options);
    return shipAddress;
  };

  public indexById = async (id: number) => {
    const shipAddress = await this.shippingAddressRepository.findOne(id);
    return shipAddress;
  };

  public create = async (
    shippingAddress: ShippingAddress,
    creatorId: number
  ) => {
    const newAddress = await this.shippingAddressRepository
      .create({
        ...shippingAddress,
        creatorId,
      })
      .save();

    return newAddress;
  };

  public update = async (
    shippingAddress: ShippingAddress,
    id: number,
    creatorId: number
  ) => {
    const updateAddress = await this.shippingAddressRepository
      .createQueryBuilder()
      .update(ShippingAddress)
      .set({ ...shippingAddress })
      .where('id = :id and "creatorId" = :creatorId', {
        id,
        creatorId,
      })
      .returning('*')
      .execute();

    return updateAddress.raw[0];
  };

  public delete = async (id: number, creatorId: number) => {
    const deleteAddress = await this.shippingAddressRepository.delete({
      id,
      creatorId,
    });
    return deleteAddress;
  };
}
