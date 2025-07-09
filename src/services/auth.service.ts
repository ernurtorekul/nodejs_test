import { PrismaClient, Role, Status } from '@prisma/client';
import bcrypt from 'bcrypt';
import ApiError from '../exceptions/ApiError';
import { generateTokens } from '../utils/token';

const prisma = new PrismaClient();

class AuthService {
  async register(email: string, password: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw ApiError.BadRequest('Пользователь уже существует');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashPassword,
        fullName: 'Default Name',
        birthDate: new Date(),
        role: Role.USER,
        status: Status.ACTIVE,
      },
    });

    const payload = { id: user.id, role: user.role };
    const tokens = generateTokens(payload);

    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
      },
    });

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw ApiError.BadRequest('Пользователь не найден');
    }

    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest('Неверный пароль');
    }

    const payload = { id: user.id, role: user.role };
    const tokens = generateTokens(payload);

    await prisma.refreshToken.upsert({
      where: { userId: user.id },
      update: { token: tokens.refreshToken },
      create: {
        token: tokens.refreshToken,
        userId: user.id,
      },
    });

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async logout(refreshToken: string) {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    return { message: 'Вы успешно вышли из системы' };
  }

  async refresh(refreshToken: string) {
    const tokenFromDb = await prisma.refreshToken.findFirst({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const payload = { id: tokenFromDb.user.id, role: tokenFromDb.user.role };
    const tokens = generateTokens(payload);

    await prisma.refreshToken.update({
      where: { id: tokenFromDb.id },
      data: { token: tokens.refreshToken },
    });

    return {
      ...tokens,
      user: {
        id: tokenFromDb.user.id,
        email: tokenFromDb.user.email,
        role: tokenFromDb.user.role,
      },
    };
  }
}

export default new AuthService();
