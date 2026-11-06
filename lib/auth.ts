import 'server-only';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { verifyToken } from './session';
import { prisma } from './prisma';

export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;

  if (!sessionToken) {
    return null;
  }

  const payload = verifyToken(sessionToken);

  if (!payload?.userId) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    return user;
  } catch (err) {
    console.error('Database error while fetching current user:', err);
    return null;
  }
});
