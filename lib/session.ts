import 'server-only';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export interface SessionPayload {
  userId: string;
}

const SECRET_KEY = process.env.JWT_SECRET || 'default_dev_secret';

export const signToken = (payload: SessionPayload): string => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });
};

export const verifyToken = (
  token: string | undefined = ''
): SessionPayload | null => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded as SessionPayload;
  } catch {
    return null;
  }
};

export const createSession = async (userId: string) => {
  const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const token = signToken({ userId });
  const cookieStore = await cookies();

  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiredAt,
    sameSite: 'lax',
    path: '/',
  });
};

export const deleteSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete('session');
};
