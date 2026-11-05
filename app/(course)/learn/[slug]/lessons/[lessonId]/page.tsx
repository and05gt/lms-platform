import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import VideoPlayer from '@/components/course/VideoPlayer';
import LockBanner from '@/components/course/LockBanner';
import { FileText, CheckCircle2 } from 'lucide-react';

interface LessonPageProps {
  params: Promise<{
    slug: string;
    lessonId: string;
  }>;
}

const LessonPage = async ({ params }: LessonPageProps) => {
  const { slug, lessonId } = await params;

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      module: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!lesson || lesson.module.course.slug !== slug) {
    notFound();
  }

  const course = lesson.module.course;

  // !temp auth
  const hasPurchased = false;

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

        {!isLocked && (
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-slate-100 text-sm font-medium transition-colors self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4 text-slate-500" />
            <span>Позначити як пройдений</span>
          </button>
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
