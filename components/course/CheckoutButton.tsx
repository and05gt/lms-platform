'use client';

import { useTransition } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { createCheckoutSession } from '@/actions/checkout';

interface CheckoutButtonProps {
  courseId: string;
}

const CheckoutButton = ({ courseId }: CheckoutButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const handleCheckout = () => {
    startTransition(async () => {
      await createCheckoutSession(courseId);
    });
  };

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={isPending}
      className="w-full py-4 px-6 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:bg-sky-500/50 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-sky-500/20 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed">
      {isPending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Підготовка до оплати...</span>
        </>
      ) : (
        <>
          <span>Отримати повний доступ</span>
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
};
export default CheckoutButton;
