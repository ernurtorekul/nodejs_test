import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

// Routes will go here later
app.get('/', (req, res) => {
  res.send('API is working!');
});

export default app;
