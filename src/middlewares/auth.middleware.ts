import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ApiError from '../exceptions/ApiError';

interface AuthPayload {
  id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(ApiError.UnauthorizedError());
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return next(ApiError.UnauthorizedError());
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
    req.user = payload;

    next();
  } catch (e) {
    return next(ApiError.UnauthorizedError());
  }
}
