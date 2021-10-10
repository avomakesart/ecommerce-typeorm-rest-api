import { Router } from 'express';
import { UserController } from '../controllers';
import { admin } from '../middleware/authMiddleware';

export class UserRoutes {
  public router: Router;
  public userController: UserController;

  constructor() {
    this.userController = new UserController();
    this.router = Router();
    this.routes();
  }

  /**
   * @desc Routes for user controller
   * @returns CRUD routes
   **/
  public routes() {
    this.router.get('/', admin, this.userController.getAllUsers);
    this.router.get('/:id', admin, this.userController.getUserById);
    this.router.put('/:id', admin, this.userController.updateUser);
    this.router.delete('/:id', admin, this.userController.deleteUser);

    this.router.get('/profile/:id', this.userController.getUserProfile);
    this.router.put('/profile/:id', this.userController.updateUserProfile);
    this.router.post('/', this.userController.register);
    this.router.post('/login', this.userController.login);
  }
}
