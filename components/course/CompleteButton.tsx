'use client';

import { useTransition } from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { toggleLessonProgress } from '@/actions/progress';
import { useRouter } from 'next/navigation';

interface CompleteButtonProps {
  lessonId: string;
  courseSlug: string;
  isCompleted: boolean;
  nextLessonId?: string | null;
}

const CompleteButton = ({
  lessonId,
  courseSlug,
  isCompleted,
  nextLessonId,
}: CompleteButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleLessonProgress(lessonId, courseSlug);

      if (!isCompleted && nextLessonId) {
        router.push(`/learn/${courseSlug}/lessons/${nextLessonId}`);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all cursor-pointer disabled:cursor-not-allowed ${
        isCompleted
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
          : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
      }`}>
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
      ) : isCompleted ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
      ) : (
        <Circle className="w-4 h-4 text-slate-500" />
      )}
      <span>{isCompleted ? 'Урок пройдено' : 'Позначити як пройдений'}</span>
    </button>
  );
};
export default CompleteButton;
