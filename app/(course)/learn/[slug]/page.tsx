import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

interface LearnSlugPageProps {
  params: Promise<{ slug: string }>;
}

const LearnSlugPage = async ({ params }: LearnSlugPageProps) => {
  const { slug } = await params;

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
            take: 1,
          },
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  const firstLesson = course.modules.flatMap(module => module.lessons).at(0);

  if (!firstLesson) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h2 className="text-xl font-bold text-slate-200">
          Уроки для цього курсу ще готуються
        </h2>

        <p className="text-sm text-slate-500 mt-2">
          Автор ще не завантажив навчальні матеріали. Спробуйте пізніше.
        </p>
      </div>
    );
  }

  redirect(`/learn/${slug}/lessons/${firstLesson.id}`);
};
export default LearnSlugPage;
