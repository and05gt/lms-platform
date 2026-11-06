import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ArrowRight, BookOpen, CheckCircle2, PlayCircle } from 'lucide-react';
import Link from 'next/link';

const CoursesPage = async () => {
  const user = await getCurrentUser();

  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    include: {
      modules: {
        include: {
          lessons: {
            select: { id: true, isFree: true },
          },
        },
      },
      purchases: user
        ? {
            where: { userId: user.id },
            select: { id: true },
          }
        : false,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Доступні курси
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          {user
            ? `Вітаємо, ${user.email}! Оберіть курс для продовження навчання або перегляньте нові програми.`
            : 'Оберіть практичний курс для розвитку своїх професійних навичок.'}
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-300">
            Курсів поки що немає
          </h3>
          <p className="text-slate-500 text-sm mt-1">
            Запустіть <code className="text-sky-400">npx prisma db seed</code>,
            щоб наповнити базу.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => {
            const isPurchased = (course.purchases?.length ?? 0) > 0;
            const totalLessons = course.modules.reduce(
              (acc, m) => acc + m.lessons.length,
              0
            );

            const formattedPrice = new Intl.NumberFormat('uk-UA', {
              style: 'currency',
              currency: course.currency,
              minimumFractionDigits: 0,
            }).format(course.price / 100);

            return (
              <div
                key={course.id}
                className="flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all shadow-lg hover:shadow-slate-900/50 backdrop-blur-sm">
                <div className="h-32 bg-linear-to-br from-sky-900/30 via-slate-900 to-indigo-950/40 p-6 flex items-start justify-between border-b border-slate-800/60">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-950/60 text-slate-300 border border-slate-800">
                    {course.modules.length}{' '}
                    {course.modules.length === 1 ? 'модуль' : 'модулі'}
                  </span>

                  {isPurchased ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Придбано
                    </span>
                  ) : (
                    <span className="text-sm font-bold text-white">
                      {formattedPrice}
                    </span>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-100 group-hover:text-sky-400 transition-colors line-clamp-2">
                      {course.title}
                    </h2>

                    <p className="text-sm text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {course.description ||
                        'Опис курсу з детальним розбором практичних прикладів.'}
                    </p>

                    <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">
                        {totalLessons} уроків
                      </span>

                      {isPurchased ? (
                        <Link
                          href={`/learn/${course.slug}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-sky-500/10">
                          <PlayCircle className="w-4 h-4" />
                          <span>Навчатися</span>
                        </Link>
                      ) : (
                        <Link
                          href={`/courses/${course.slug}`}
                          className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors">
                          <span>Детальніше</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default CoursesPage;
