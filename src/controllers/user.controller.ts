import argon2 from 'argon2';
import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';
import { getConnection, getRepository } from 'typeorm';
import { User } from '../entities';
import { UserService } from '../services'; // import service
import { validateRegister } from '../utils/validateRegister';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService(); // Create a new instance of PostController
  }

  public register = async (
    req: Request & {
      session: Session & Partial<SessionData> & { userId?: number };
    },
    res: Response
  ) => {
    const { firstName, lastName, email, username, password, pictureUrl } =
      req.body as User;

    let user = new User();

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.username = username;
    user.pictureUrl = pictureUrl;
    user.password = password;

    const errors = validateRegister(user);
    if (errors) {
      res.status(400).send(errors);
      return;
    }

    const hashedPassword = await argon2.hash(password);

    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          firstName,
          lastName,
          username,
          email,
          pictureUrl:
            'https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png',
          password: hashedPassword,
        })
        .returning('*')
        .execute();
      user = result.raw[0];
      await this.userService.register(user);

      const newUser = await this.userService.register(user);
      res.send(newUser);
    } catch (err) {
      //|| err.detail.includes("already exists")) {
      // duplicate username error
      if (err.code === '23505') {
        return {
          errors: [
            {
              field: 'username',
              message: 'username already taken',
            },
          ],
        };
      }
    }

    // store user id session
    // this will set a cookie on the user
    // keep them logged in
    req.session.userId = user.id;

    res.status(201).send('User created');
    return user;
  };

  public login = async (
    req: Request & {
      session: Session & Partial<SessionData> & { userId?: number };
    },
    res: Response
  ) => {
    let { username, email, password } = req.body;

    if (!((username || email) && password)) {
      res.status(400).send();
    }

    const userRepository = getRepository(User);
    let user = new User();
    try {
      user = await userRepository.findOneOrFail({ where: { username } });
    } catch (error) {
      res.status(401).send();
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      res.status(401).send();
      return;
    }

    req.session.userId = user.id;

    res.status(201).json({
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email,
      username,
      role: user.role,
    });
  };

  public getUserProfile = async (
    req: Request & {
      session: Session & Partial<SessionData> & { userId?: number };
    },
    res: Response
  ) => {
    const id = req['params']['id'];
    const user = await this.userService.indexById(Number(id));

    const userId = Number(req.session.userId);

    if (userId === Number(id)) {
      res.json({
        id: user?.id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        username: user?.username,
        role: user?.role,
        pictureUrl: user?.pictureUrl,
        bio: user?.bio,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  };

  public updateUserProfile = async (
    req: Request & {
      session: Session & Partial<SessionData> & { userId?: number };
    },
    res: Response
  ) => {
    const {
      firstName,
      lastName,
      email,
      username,
      role,
      pictureUrl,
      bio,
      password,
    } = req['body'] as User;
    const id = req['params']['id'];
    const user = await this.userService.getUserById(Number(id));

    const userId = Number(req.session.userId);

    if (userId === Number(id)) {
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.email = email || user.email;
      user.username = username || user.username;
      user.role = role || user.role;
      user.pictureUrl = pictureUrl || user.pictureUrl;
      user.bio = bio || user.bio;
      if (password) {
        user.password = password;
      }

      const updatedUser = await this.userService.updateProfile(
        user,
        Number(id)
      );

      res.status(200).send({ ...updatedUser });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  };

  public getAllUsers = async (req: Request, res: Response) => {
    const users = await this.userService.getUsers();
    res.send(users).json();
  };

  public getUserById = async (req: Request, res: Response) => {
    const id = req['params'].id;
    const users = await this.userService.getUserById(Number(id));

    console.log(req.cookies);

    if (users) {
      res.send(users).json();
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  };

  public updateUser = async (req: Request, res: Response) => {
    const id = req['params'].id;
    const { firstName, lastName, email, role } = req['body'] as User;
    const user = await this.userService.getUserById(Number(id));

    if (user) {
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.email = email || user.email;
      user.role = role;

      const updatedUser = await user.save();

      res.json({
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  };

  public deleteUser = async (req: Request, res: Response) => {
    const id = req['params']['id'];
    const user = await this.userService.getUserById(Number(id));

    if (user) {
      res.send(this.userService.deleteUser(Number(id)));
      res.json({ message: 'User removed' });
    } else {
      res.status(404).send('User not found');
      return;
    }
  };
}
