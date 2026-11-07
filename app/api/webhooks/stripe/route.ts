import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const POST = async (req: Request) => {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return new NextResponse('Missing stripe-signature header', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error(
      `❌ Webhook signature verification failed: ${err instanceof Error && err.message}`
    );
    return new NextResponse(
      `Webhook Error: ${err instanceof Error && err.message}`,
      { status: 400 }
    );
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const courseId = session.metadata?.courseId;
    const userId = session.metadata?.userId;
    const amountTotal = session.amount_total;

    if (!courseId || !userId) {
      console.error('Missing courseId in metadata or customer email');
      return new NextResponse('Invalid session payload', { status: 400 });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        console.error(`User with id ${userId} not found in database`);
        return new NextResponse('User not found', { status: 404 });
      }

      await prisma.purchase.upsert({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: courseId,
          },
        },
        update: {
          stripeSessionId: session.id,
          amount: amountTotal ?? 0,
        },
        create: {
          userId: user.id,
          courseId: courseId,
          stripeSessionId: session.id,
          amount: amountTotal ?? 0,
        },
      });

      console.log(
        `✅ Доступ до курсу ${courseId} надано користувачу ${user.email} (ID: ${user.id})`
      );

      return new NextResponse(null, { status: 200 });
    } catch (err) {
      console.error('Database error while processing purchase:', err);
      return new NextResponse('Database error', { status: 500 });
    }
  }
  return new NextResponse(null, { status: 200 });
};
