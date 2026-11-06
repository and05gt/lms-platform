'use server';

import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { createSession, deleteSession } from '@/lib/session';

export interface FormState {
  error?: string;
}

export const registerAction = async (
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> => {
  const email = formData.get('email')?.toString().trim().toLowerCase();
  const password = formData.get('password')?.toString();
  const confirmPassword = formData.get('confirmPassword')?.toString();

  if (!email || !password || !confirmPassword) {
    return { error: 'Будь ласка, заповніть усі поля.' };
  }

  if (password.length < 6) {
    return { error: 'Пароль має містити щонайменше 6 символів.' };
  }

  if (password !== confirmPassword) {
    return { error: 'Паролі не збігаються.' };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: 'Користувач із цією поштою вже зареєстрований.' };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: Role.STUDENT,
    },
  });

  redirect('/login');
};

export const loginAction = async (
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> => {
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

  redirect('/');
};

export const logoutAction = async () => {
  await deleteSession();
  redirect('/login');
};
