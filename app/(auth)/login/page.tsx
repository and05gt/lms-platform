import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import LoginForm from '@/components/auth/LoginForm';

const LoginPage = async () => {
  const user = await getCurrentUser();

  if (user) {
    redirect('/');
  }

  return (
    <div className="relative overflow-hidden min-h-screen bg-slate-950 bg-linear-to-b from-slate-900/50 to-slate-950 flex items-center justify-center px-4 py-12">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Вхід до навчальної платформи
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Введіть свої дані для перегляду придбаних курсів
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
};
export default LoginPage;
