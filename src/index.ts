import colors from 'colors';
import connectRedis from 'connect-redis';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import { createConnection } from 'typeorm';
import { COOKIE_NAME, __prod__ } from './constants';
import {
  Category,
  Coupon,
  Images,
  Order,
  OrderItem,
  Products,
  ShippingAddress,
  User,
} from './entities';
import { errorHandler, notFound } from './middleware/errorMiddleware';
import {
  CategoryRoutes,
  CouponRoutes,
  OrderRoutes,
  ProductRoutes,
  ShippingAddressRoutes,
  UserRoutes,
} from './routes';

dotenv.config();

class Main {
  private productRoutes: ProductRoutes;
  private userRoutes: UserRoutes;
  private orderRoutes: OrderRoutes;
  private couponRoutes: CouponRoutes;
  private shippingAddressRoutes: ShippingAddressRoutes;
  private categoryRoutes: CategoryRoutes;
  private app: express.Application;
  public RedisStore = connectRedis(session);
  public redis = new Redis('127.0.0.1:6379');

  constructor() {
    this.app = express();
    this.RedisStore;
    this.redis;
    this.configuration();
    this.routes();
  }

  /**
   * @desc Configures the server
   * @desc If we don't have and .env with PORT, we use the 7000
   * @returns server configuration
   **/

  public configuration() {
    this.app.set('port', process.env.PORT || 7000);
    this.app.use(express.json());
    this.app.set('trust proxy', 1);
    this.app.use(
      cors({
        origin: '*',
        credentials: false,
      })
    );
    this.app.use(
      session({
        name: COOKIE_NAME,
        store: new this.RedisStore({
          client: this.redis,
          disableTouch: true,
        }),
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
          httpOnly: true,
          sameSite: 'lax',
          secure: __prod__,
          domain: __prod__ ? '.alvarocastle.com' : undefined,
        },
        saveUninitialized: false,
        secret: 'Ofeliathebrowndog777',
        resave: false,
      })
    );
  }

  public async routes() {
    await createConnection({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      logging: true,
      synchronize: true,
      entities: [
        OrderItem,
        Coupon,
        Images,
        Order,
        Products,
        User,
        Category,
        ShippingAddress,
      ],
    });

    this.productRoutes = new ProductRoutes();
    this.userRoutes = new UserRoutes();
    this.orderRoutes = new OrderRoutes();
    this.couponRoutes = new CouponRoutes();
    this.shippingAddressRoutes = new ShippingAddressRoutes();
    this.categoryRoutes = new CategoryRoutes();

    this.app.get('/', ({ res }) =>
      res?.status(200).json({
        greeting: 'Hey welcome to this simple api',
        message: 'Use this for any personal project, it`s free dude!',
        rules: 'Do anything that you want',
      })
    );
    this.app.use(`/api/products`, this.productRoutes.router); // Configure the new routes of the controller post
    this.app.use(`/api/users`, this.userRoutes.router);
    this.app.use(`/api/orders`, this.orderRoutes.router);
    this.app.use(`/api/coupons`, this.couponRoutes.router);
    this.app.use(`/api/shippingAddress`, this.shippingAddressRoutes.router);
    this.app.use(`/api/categories`, this.categoryRoutes.router);

    this.app.use(notFound);
    this.app.use(errorHandler);
  }

  /**
   * @desc Starts the server
   **/
  public start() {
    const PORT = process.env.PORT || 7000;
    this.app.listen(this.app.get('port'), () => {
      console.log(
        `Server started on http://localhost:${colors.yellow(PORT.toString())}`
      );
    });
  }
}

const server = new Main();
server.start();
