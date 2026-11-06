'use client';

import { logoutAction } from '@/actions/auth';
import { Loader2, LogOut } from 'lucide-react';
import { useTransition } from 'react';

interface LogoutButtonProps {
  variant: 'ghost' | 'sidebar';
  className?: string;
}

const LogoutButton = ({
  variant = 'ghost',
  className = '',
}: LogoutButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  if (variant === 'sidebar') {
    return (
      <button
        type="button"
        onClick={handleLogout}
        disabled={isPending}
        className={`w-full flex items-center gap-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-50 cursor-pointer ${className}`}>
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
        ) : (
          <LogOut className="h-4 w-4 shrink-0" />
        )}
        <span>{isPending ? 'Вихід...' : 'Вийти з акаунту'}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 rounded-md transition-colors disabled:opacity-50 cursor-pointer ${className}`}>
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <LogOut className="h-3.5 w-3.5" />
      )}
      <span>{isPending ? 'Вихід...' : 'Вийти'}</span>
    </button>
  );
};
export default LogoutButton;
