'use server';

import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { createSession, deleteSession } from '@/lib/session';

export interface LoginFormState {
  error?: string;
}

export const loginAction = async (
  prevState: LoginFormState | null,
  formData: FormData
): Promise<LoginFormState> => {
  const email = formData.get('email')?.toString().trim().toLowerCase();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return { error: 'Будь ласка, заповніть усі поля.' };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user?.passwordHash) {
    return { error: 'Невірний email або пароль.' };
  }

  const isPasswordValid = await bcrypt.compare(password, user?.passwordHash);

  if (!isPasswordValid) {
    return { error: 'Невірний email або пароль.' };
  }

  await createSession(user?.id);

  redirect('/learn');
};

export const logoutAction = async () => {
  await deleteSession();
  redirect('/login');
};
