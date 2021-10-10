import { Response, Request, NextFunction } from 'express';
import { Session, SessionData } from 'express-session';
import { Redis } from 'ioredis';

export type Context = {
  res: Response;
  req: Request & {
    session: Session & Partial<SessionData> & { userId?: number };
  };
  redis: Redis;
  next: NextFunction;
  err: any;
};
