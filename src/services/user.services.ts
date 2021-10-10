import { getConnection } from 'typeorm';
import { User } from '../entities';
import { UserRepository } from '../repository';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = getConnection().getCustomRepository(UserRepository);
  }

  public getUsers = async () => {
    const users = await this.userRepository.find();
    return users;
  };

  public getUserById = async (id: number) => {
    const userById = await this.userRepository.findOneOrFail(id);
    return userById;
  };

  public indexById = async (id: number) => {
    const indexId = await this.userRepository.findOne(id);
    return indexId;
  };

  public register = async (user: User) => {
    const newUser = await this.userRepository.save(user);
    return newUser;
  };

  public updateProfile = async (user: User, id: number) => {
    const updateUser = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ ...user })
      .where('id = :id', {
        id,
      })
      .returning('*')
      .execute();
      
    return updateUser.raw[0];
  };

  public updateUser = async (user: User, id: number) => {
    const updatedUser = await this.userRepository.update(id, user);
    return updatedUser;
  };

  public deleteUser = async (id: number) => {
    const deletedUser = await this.userRepository.delete(id);
    return deletedUser;
  };
}
