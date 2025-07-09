import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import AuthService from "../services/auth.service";
import ApiError from '../exceptions/ApiError';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest('Invalid data', errors.array()));
    }

    const { email, password } = req.body;
    const userData = await AuthService.register(email, password);

    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(200).json({ ...userData, message: 'Зарегистрировано успешно' });
  } catch (e) {
    next(e);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const userData = await AuthService.login(email, password);

    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(200).json({ ...userData, message: 'Вход выполнен успешно' });
  } catch (e) {
    next(e);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;
    const result = await AuthService.logout(refreshToken);

    res.clearCookie('refreshToken');
    return res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;
    const userData = await AuthService.refresh(refreshToken);

    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(200).json(userData);
  } catch (e) {
    next(e);
  }
};
