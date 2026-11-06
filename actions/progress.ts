'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const toggleLessonProgress = async (
  lessonId: string,
  courseSlug: string
) => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Необхідно увійти в систему');
  }

  const existingProgress = await prisma.lessonProgress.findUnique({
    where: {
      userId_lessonId: {
        userId: user.id,
        lessonId: lessonId,
      },
    },
  });

  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: user.id,
        lessonId: lessonId,
      },
    },
    update: {
      isCompleted: !existingProgress?.isCompleted,
    },
    create: {
      userId: user.id,
      lessonId: lessonId,
      isCompleted: true,
    },
  });

  revalidatePath(`/learn/${courseSlug}`, 'layout');
};
