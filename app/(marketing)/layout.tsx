import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import LogoutButton from '@/components/auth/LogoutButton';
import { getCurrentUser } from '@/lib/auth';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

const MarketingLayout = async ({ children }: MarketingLayoutProps) => {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="h-16 border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-base text-white tracking-tight hover:text-sky-400 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span>LMS Platform</span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-400 hidden sm:inline border-r border-slate-800 pr-4">
                {user.email}
              </span>
              <LogoutButton variant="ghost" />
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="text-xs font-semibold px-3.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all">
                Увійти
              </Link>
              <Link
                href="/register"
                className="text-xs font-semibold px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 transition-all shadow-md shadow-sky-500/10 active:scale-[0.98]">
                Реєстрація
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
};
export default MarketingLayout;
