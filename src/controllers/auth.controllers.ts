import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, birthDate, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        birthDate: new Date(birthDate),
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: 'User registered', userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
