import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

export const generateTokens = (payload: object) => {
  const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '30d' });
  return { accessToken, refreshToken };
};

export const validateAccessToken = (token: string) => {
  try {
    return jwt.verify(token, ACCESS_SECRET);
  } catch {
    return null;
  }
};

export const validateRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch {
    return null;
  }
};
