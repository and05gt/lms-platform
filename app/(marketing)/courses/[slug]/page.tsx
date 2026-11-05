import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import {
  PlayCircle,
  Lock,
  CheckCircle2,
  Clock,
  BookOpen,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface CourseLandingPageProps {
  params: Promise<{ slug: string }>;
}

const CourseLandingPage = async ({ params }: CourseLandingPageProps) => {
  const { slug } = await params;

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  const totalLessons = course.modules.reduce(
    (acc, m) => acc + m.lessons.length,
    0
  );

  const firstFreeLesson = course.modules
    .flatMap(m => m.lessons)
    .find(l => l.isFree);

  const formattedPrice = new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: course.currency,
    minimumFractionDigits: 0,
  }).format(course.price / 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <section className="relative overflow-hidden border-b border-slate-800/80 bg-linear-to-b from-slate-900/50 to-slate-950 py-16 sm:py-24">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Практичний онлайн-курс</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {course.title}
              </h1>

              <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
                {course.description ||
                  'Опануйте ключові навички за чіткою структурою, відеоуроками та реальними прикладами.'}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-sky-400" />
                  <span>{course.modules.length} модулі</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <span>{totalLessons} практичних уроків</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Довічний доступ</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                {firstFreeLesson && (
                  <Link
                    href={`/learn/${course.slug}/lessons/${firstFreeLesson.id}`}
                    className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium text-sm transition-all">
                    <PlayCircle className="w-4 h-4 text-sky-400" />
                    <span>Спробувати безкоштовно</span>
                  </Link>
                )}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm relative">
                <div className="mb-6">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Вартість доступу
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-extrabold text-white tracking-tight">
                      {formattedPrice}
                    </span>
                    <span className="text-xs text-slate-400">/ одноразово</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8 text-sm text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Доступ до всіх {totalLessons} уроків 24/7</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Практичні конспекти та матеріали</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Відстеження особистого прогресу</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full py-4 px-6 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-sky-500/20 active:scale-[0.98] flex items-center justify-center gap-2">
                  <span>Отримати повний доступ</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-center text-slate-500 mt-4">
                  Безпечна оплата через Stripe (Apple Pay, Google Pay,
                  банківські картки)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Програма курсу
          </h2>
          <p className="text-slate-400 text-sm">
            Ознайомтеся з темами занять. Уроки з міткою «Демо» можна переглянути
            без оплати.
          </p>
        </div>

        <div className="space-y-6">
          {course.modules.map((module, mIndex) => (
            <div
              key={module.id}
              className="border border-slate-800/80 bg-slate-900/40 rounded-xl overflow-hidden">
              <div className="px-6 py-4 bg-slate-900/70 border-b border-slate-800/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
                    Модуль {mIndex + 1}
                  </span>
                  <h3 className="text-base font-semibold text-slate-100 mt-0.5">
                    {module.title}
                  </h3>
                </div>
                <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">
                  {module.lessons.length}{' '}
                  {module.lessons.length === 1 ? 'урок' : 'уроки'}
                </span>
              </div>

              <div className="divide-y divide-slate-800/40">
                {module.lessons.map(lesson => (
                  <div
                    key={lesson.id}
                    className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-900/30 transition-colors">
                    <div className="flex items-center gap-3.5 min-w-0">
                      {lesson.isFree ? (
                        <PlayCircle className="w-4 h-4 text-sky-400 shrink-0" />
                      ) : (
                        <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <span className="text-sm font-medium text-slate-200 truncate">
                        {lesson.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {lesson.isFree ? (
                        <Link
                          href={`/learn/${course.slug}/lessons/${lesson.id}`}
                          className="text-xs font-semibold px-2.5 py-1 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20 transition-colors">
                          Дивитися демо
                        </Link>
                      ) : (
                        <span className="text-xs text-slate-500 font-medium">
                          Закрито
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
export default CourseLandingPage;
