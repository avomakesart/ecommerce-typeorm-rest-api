import { EntityRepository, Repository } from 'typeorm';
import { Products } from '../entities';

@EntityRepository(Products)
export class ProductRepository extends Repository<Products> {}
