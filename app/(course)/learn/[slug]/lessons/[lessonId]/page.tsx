import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import VideoPlayer from '@/components/course/VideoPlayer';
import LockBanner from '@/components/course/LockBanner';
import { FileText } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import CompleteButton from '@/components/course/CompleteButton';

interface LessonPageProps {
  params: Promise<{
    slug: string;
    lessonId: string;
  }>;
}

const LessonPage = async ({ params }: LessonPageProps) => {
  const { slug, lessonId } = await params;
  const user = await getCurrentUser();

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      module: {
        include: {
          course: {
            include: {
              modules: {
                orderBy: { order: 'asc' },
                include: {
                  lessons: {
                    orderBy: { order: 'asc' },
                    select: { id: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!lesson || lesson.module.course.slug !== slug) {
    notFound();
  }

  const course = lesson.module.course;

  const allLessons = course.modules.flatMap(m => m.lessons);
  const currentIndex = allLessons.findIndex(l => l.id === lesson.id);

  const nextLessonId =
    currentIndex !== -1 && currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1].id
      : null;

  let isCompleted = false;
  if (user) {
    const progress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: lesson.id,
        },
      },
    });
    isCompleted = !!progress?.isCompleted;
  }

  let hasPurchased = false;
  if (user) {
    const purchase = await prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
    });
    hasPurchased = !!purchase;
  }

  const isLocked = !lesson.isFree && !hasPurchased;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-8">
        {isLocked ? (
          <LockBanner
            courseSlug={course.slug}
            coursePrice={course.price}
            currency={course.currency}
          />
        ) : (
          <VideoPlayer videoUrl={lesson.videoUrl} title={lesson.title} />
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-400 mb-1 block">
            {lesson.module.title}
          </span>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            {lesson.title}
          </h1>
        </div>

        {!isLocked && user && (
          <CompleteButton
            lessonId={lesson.id}
            courseSlug={course.slug}
            isCompleted={isCompleted}
            nextLessonId={nextLessonId}
          />
        )}
      </div>

      {isLocked ? (
        <div className="p-6 bg-slate-900/30 border border-dashed border-slate-800 rounded-xl text-center">
          <p className="text-sm text-slate-500">
            Конспект та практичні матеріали приховані для закритого уроку.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-300 font-semibold text-base">
            <FileText className="w-5 h-5 text-sky-400" />
            <h2>Матеріали уроку</h2>
          </div>

          <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-xl text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">
            {lesson.content ||
              'Для цього уроку немає додаткових текстових матеріалів.'}
          </div>
        </div>
      )}
    </div>
  );
};
export default LessonPage;
