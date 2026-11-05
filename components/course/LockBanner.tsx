import Link from 'next/link';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';

interface LockBannerProps {
  courseSlug: string;
  coursePrice: number;
  currency: string;
}

const LockBanner = ({ courseSlug, coursePrice, currency }: LockBannerProps) => {
  const formattedPrice = new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(coursePrice / 100);

  return (
    <div className="w-full aspect-video bg-slate-900/60 border border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden backdrop-blur-sm">
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/60 mb-4 shadow-inner">
        <Lock className="w-8 h-8 text-sky-400" />
      </div>

      <h3 className="text-xl font-bold text-slate-100 mb-2">
        Цей урок доступний лише учасникам курсу
      </h3>

      <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
        Отримайте повний доступ до всіх модулів, практичних завдань та
        конспектів без обмежень за часом.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          href={`/courses/${courseSlug}`}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-sky-500/20 active:scale-95">
          <Sparkles className="w-4 h-4" />
          <span>Придбати курс за {formattedPrice}</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};
export default LockBanner;
