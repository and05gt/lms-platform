'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PlayCircle, Lock, CheckCircle2 } from 'lucide-react';

interface LessonItemProps {
  id: string;
  title: string;
  courseSlug: string;
  isFree: boolean;
  isLocked: boolean;
  isCompleted?: boolean;
}

const LessonItem = ({
  id,
  title,
  courseSlug,
  isFree,
  isLocked,
  isCompleted = false,
}: LessonItemProps) => {
  const pathname = usePathname();
  const href = `/learn/${courseSlug}/lessons/${id}`;
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`group flex items-center gap-x-3 px-4 py-3 text-sm font-medium transition-colors border-l-2 ${
        isActive
          ? 'border-sky-500 bg-slate-800/80 text-sky-400'
          : 'border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200'
      }`}>
      <div className="shrink-0">
        {isCompleted ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        ) : isLocked ? (
          <Lock className="h-4 w-4 text-slate-500 group-hover:text-slate-400" />
        ) : (
          <PlayCircle
            className={`h-4 w-4 ${
              isActive
                ? 'text-sky-400'
                : 'text-slate-400 group-hover:text-slate-200'
            }`}
          />
        )}
      </div>

      <span className="truncate flex-1">{title}</span>

      {isFree && isLocked && (
        <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
          Free
        </span>
      )}
    </Link>
  );
};
export default LessonItem;
