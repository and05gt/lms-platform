'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight, BookOpen } from 'lucide-react';
import LessonItem from './LessonItem';
import LogoutButton from '../auth/LogoutButton';

interface Lesson {
  id: string;
  title: string;
  order: number;
  isFree: boolean;
}

interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface SidebarProps {
  course: {
    id: string;
    title: string;
    slug: string;
    modules: Module[];
  };
  userEmail?: string;
  hasPurchased?: boolean;
  completedLessonIds?: string[];
}

const Sidebar = ({
  course,
  userEmail,
  hasPurchased = false,
  completedLessonIds = [],
}: SidebarProps) => {
  const pathname = usePathname();
  const [openModules, setOpenModules] = useState<Record<string, boolean>>(
    () => {
      const initialState: Record<string, boolean> = {};
      course.modules.forEach(module => {
        const hasActiveLesson = module.lessons.some(
          lesson => pathname === `/learn/${course.slug}/lessons/${lesson.id}`
        );
        initialState[module.id] = hasActiveLesson || module.order === 1;
      });
      return initialState;
    }
  );

  const toggleModule = (moduleId: string) => {
    setOpenModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const totalLessons = course.modules.reduce(
    (acc, m) => acc + m.lessons.length,
    0
  );
  const progressPercentage =
    totalLessons > 0
      ? Math.round((completedLessonIds.length / totalLessons) * 100)
      : 0;

  return (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800">
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="h-5 w-5 text-sky-400" />
          <h2 className="font-semibold text-slate-100 text-sm leading-snug line-clamp-2">
            {course.title}
          </h2>
        </div>

        {hasPurchased && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>Progress</span>
              <span>{progressPercentage}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {course.modules.map(module => {
          const isOpen = !!openModules[module.id];

          return (
            <div key={module.id} className="mb-2">
              <button
                type="button"
                onClick={() => toggleModule(module.id)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 transition-colors">
                <span className="truncate text-left pr-2">{module.title}</span>
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
                )}
              </button>

              {isOpen && (
                <div className="mt-0.5 space-y-0.5">
                  {module.lessons.map(lesson => {
                    const isLocked = !hasPurchased && !lesson.isFree;
                    const isCompleted = completedLessonIds.includes(lesson.id);

                    return (
                      <LessonItem
                        key={lesson.id}
                        id={lesson.id}
                        title={lesson.title}
                        courseSlug={course.slug}
                        isFree={lesson.isFree}
                        isLocked={isLocked}
                        isCompleted={isCompleted}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {userEmail && (
        <div className="p-4 border-t border-slate-800 bg-slate-900/40 space-y-2">
          {userEmail && (
            <div className="px-3 py-1 text-xs text-slate-500 truncate">
              {userEmail}
            </div>
          )}
          <LogoutButton variant="sidebar" />
        </div>
      )}
    </div>
  );
};
export default Sidebar;
