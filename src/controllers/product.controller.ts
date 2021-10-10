import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';
import { Products } from '../entities';
import { ProductService } from '../services'; // import service

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService(); // Create a new instance of PostController
  }

  public getProducts = async (req: Request, res: Response) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
          name: req.query.keyword,
        }
      : {};

    const count = await Products.count();
    const products = await this.productService.getProducts({
      where: { ...keyword },
      take: pageSize,
      skip: pageSize * (page - 1),
    });
    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  };

  public getProductsById = async (req: Request, res: Response) => {
    const id = req['params'].id;
    const product = await this.productService.getProductById(Number(id));
    if (product) {
      res.send(product).json();
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  };

  public createProduct = async (
    req: Request & {
      session: Session & Partial<SessionData> & { userId?: number };
    },
    res: Response
  ) => {
    const product = req['body'] as Products;
    const creatorId = req.session.userId;

    const newProduct = await this.productService.createProduct(
      product,
      Number(creatorId) 
    );

    res.send(newProduct);
  };

  public updateProduct = async (
    req: Request & {
      session: Session & Partial<SessionData> & { userId?: number };
    },
    res: Response
  ) => {
    const product = req['body'] as Products;
    const id = req['params']['id'];
    const creatorId = req.session.userId;

    res.send(
      this.productService.updateProduct(product, Number(id), Number(creatorId))
    );
  };

  public deleteProduct = async (
    req: Request & {
      session: Session & Partial<SessionData> & { userId?: number };
    },
    res: Response
  ) => {
    const id = req['params']['id'];
    const creatorId = req.session.userId;
    const product = await this.productService.getProductById(Number(id));

    if (product) {
      await this.productService.deleteProduct(product.id, Number(creatorId));
      res.json({ message: 'Product Removed' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
    res.send();
  };
}
