import LogoutButton from '@/components/auth/LogoutButton';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

const MarketingLayout = async ({ children }: MarketingLayoutProps) => {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="h-16 border-b border-slate-800/80 px-6 flex items-center justify-between">
        <Link
          href={'/'}
          className="font-bold text-base text-white tracking-tight">
          LMS Platform
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 hidden sm:inline">
                {user.email}
              </span>
              <LogoutButton variant="ghost" />
            </div>
          ) : (
            <Link
              href={'/login'}
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors">
              Увійти
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
};
export default MarketingLayout;
