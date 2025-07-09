import { Router } from 'express';
import { register, login, logout, refresh } from '../controllers/auth.controllers';
import authMiddleware from '../middlewares/auth.middleware';
import { getUserById } from '../controllers/user.controller';
import { getAllUsers } from '../controllers/user.controller';
import { blockUser } from '../controllers/user.controller';

const router = Router();

// Auth
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/logout', logout);
router.get('/auth/refresh', refresh);

// Users
router.get('/users/:id', authMiddleware, getUserById);
router.get('/users', authMiddleware, getAllUsers);
router.patch('/users/:id/block', authMiddleware, blockUser);

export default router;
