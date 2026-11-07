'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { getCurrentUser } from '@/lib/auth';

export const createCheckoutSession = async (courseId: string) => {
  const currentUser = await getCurrentUser();

  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new Error('Course not found');
  }

  if (!currentUser) {
    redirect('/login');
  }

  const existingPurchase = await prisma.purchase.findUnique({
    where: {
      userId_courseId: {
        userId: currentUser.id,
        courseId: course.id,
      },
    },
  });

  if (existingPurchase) {
    redirect(`/learn/${course.slug}`);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    allowed_payment_method_types: ['card'],
    mode: 'payment',
    customer_email: currentUser.email,
    line_items: [
      {
        price_data: {
          currency: course.currency.toLowerCase(),
          unit_amount: course.price,
          product_data: {
            name: course.title,
            description: course.description || undefined,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      courseId: course.id,
      userId: currentUser.id,
    },
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    success_url: `${appUrl}/learn/${course.slug}?success=1`,
    cancel_url: `${appUrl}/learn/${course.slug}?canceled=1`,
  });

  if (!session.url) {
    throw new Error('Unable to create a payment session');
  }

  redirect(session.url);
};
