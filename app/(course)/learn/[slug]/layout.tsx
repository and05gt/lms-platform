import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Sidebar from '@/components/course/Sidebar';

interface CourseLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

const CourseLayout = async ({ children, params }: CourseLayoutProps) => {
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

  // !temp
  const hasPurchased = false;
  const completeLessonIds: string[] = [];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <aside className="w-80 border-r border-slate-800 shrink-0 flex flex-col h-full">
        <Sidebar
          course={course}
          hasPurchased={hasPurchased}
          completeLessonIds={completeLessonIds}
        />
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};
export default CourseLayout;
