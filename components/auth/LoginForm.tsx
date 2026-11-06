'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { LogIn, Loader2, AlertCircle } from 'lucide-react';
import { loginAction, FormState } from '@/actions/auth';

const LoginForm = () => {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    loginAction,
    {}
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="flex items-center gap-2 p-3 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
          Електронна пошта
        </label>
        <input
          type="email"
          name="email"
          id="email"
          autoComplete="email"
          required
          placeholder="student@example.com"
          className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
          Електронна пошта
        </label>
        <input
          type="password"
          name="password"
          id="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3.5 px-4 rounded-lg bg-sky-500 hover:bg-sky-400 disabled:bg-sky-500/50 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-sky-500/20 active:scale-[0.98] flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:cursor-not-allowed">
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Вхід...</span>
          </>
        ) : (
          <>
            <LogIn className="w-4 h-4" />
            <span>Увійти в кабінет</span>
          </>
        )}
      </button>

      <p className="text-center text-xs text-slate-500 mt-4">
        Немає акаунту?{' '}
        <Link href="/register" className="text-sky-400 hover:underline">
          Зареєструватися
        </Link>
      </p>
    </form>
  );
};
export default LoginForm;
