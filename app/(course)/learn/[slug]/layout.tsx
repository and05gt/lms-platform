import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Sidebar from '@/components/course/Sidebar';
import { getCurrentUser } from '@/lib/auth';

interface CourseLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

const CourseLayout = async ({ children, params }: CourseLayoutProps) => {
  const { slug } = await params;
  const user = await getCurrentUser();

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

  let hasPurchased = false;
  let completedLessonIds: string[] = [];

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

    const allLessonsIds = course.modules.flatMap(m => m.lessons.map(l => l.id));

    const completedRecords = await prisma.lessonProgress.findMany({
      where: {
        userId: user.id,
        lessonId: { in: allLessonsIds },
        isCompleted: true,
      },
      select: { lessonId: true },
    });

    completedLessonIds = completedRecords.map(r => r.lessonId);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <aside className="w-80 border-r border-slate-800 shrink-0 flex flex-col h-full">
        <Sidebar
          course={course}
          userEmail={user?.email}
          hasPurchased={hasPurchased}
          completedLessonIds={completedLessonIds}
        />
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};
export default CourseLayout;
