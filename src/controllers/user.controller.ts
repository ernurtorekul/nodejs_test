import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import ApiError from '../exceptions/ApiError';

const prisma = new PrismaClient();

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (req.user?.id !== id && req.user?.role !== 'ADMIN') {
      return next(ApiError.Forbidden('Вам не разрешено получать доступ к этому пользователю'));
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        birthDate: true,
        role: true,
        status: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    return res.json(user);
  } catch (e) {
    next(e);
  }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return next(ApiError.Forbidden('Только администраторы могут просматривать всех пользователей'));
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
      },
    });

    res.json(users);
  } catch (e) {
    next(e);
  }
};

export const blockUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (req.user?.id !== id && req.user?.role !== 'ADMIN') {
      return next(ApiError.Forbidden('Вы не можете заблокировать этого пользователя'));
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { status: 'BLOCKED' },
    });

    res.json({ message: 'Пользователь заблокирован', userId: updated.id });
  } catch (e) {
    next(e);
  }
};

