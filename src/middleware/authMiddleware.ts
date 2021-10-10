import { NextFunction, Response, Request } from 'express';
import { Session, SessionData } from 'express-session';
import { User } from '../entities';

// const protect = async (req: Request, res: Response, next: NextFunction) => {
//   let cookie;

//   if (
//     req.headers.cookie &&
//     req.headers.cookie.startsWith('qid')
//   ) {
//     try {
//       cookie = req.headers.cookie.split(' ')[1];
//       req.cookies
//       await User.findOne(cookie.userId).select('-password')
//       next()
//     } catch (error) {
//         console.error(error);
//         res.status(401);
//         throw new Error('Not Authorized, cookie failed')
//     }
//   }

//   if (!cookie) {
//     res.status(401);
//     throw new Error('Not Authorized, no cookie provided');
//   }
// };

export const admin = async (
  req: Request & {
    session: Session & Partial<SessionData> & { userId?: number };
  },
  res: Response,
  next: NextFunction
) => {
  const user = await User.findOne(req.session.userId);

  console.log(user?.role);

  if (user?.role === 'Admin') {
    next();
  } else {
    res.status(401);
    throw new Error('Not Authorized this is an admin resource');
  }
};
