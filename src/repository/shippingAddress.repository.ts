import { EntityRepository, Repository } from 'typeorm';
import { ShippingAddress } from '../entities';

@EntityRepository(ShippingAddress)
export class ShippingAddressRepository extends Repository<ShippingAddress> {}
