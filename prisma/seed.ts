import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start populating the database with test data...');

  await prisma.lessonProgress.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  const defaultPasswordHash = await bcrypt.hash('password123', 10);

  const student = await prisma.user.create({
    data: {
      email: 'student@example.com',
      passwordHash: defaultPasswordHash,
      role: Role.STUDENT,
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      role: Role.ADMIN,
    },
  });

  console.log(`Users created: ${student.email}, ${admin.email}`);

  const course = await prisma.course.create({
    data: {
      title: 'Practical English for Beginners (A1-A2)',
      slug: 'practical-english-a1-a2',
      description:
        'Master everyday communication, essential grammar, and workplace English step-by-step.',
      price: 3900,
      currency: 'EUR',
      isPublished: true,
      modules: {
        create: [
          {
            title: 'Module 1: Foundations & Daily Routine',
            order: 1,
            lessons: {
              create: [
                {
                  title: '1. Present Simple & Talking About Your Day',
                  order: 1,
                  isFree: true,
                  videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                  content:
                    'Key concepts:\n- Affirmative, negative, and question forms with do/does.\n- Adverbs of frequency (always, usually, sometimes, never).\n- Vocabulary: commute, schedule, shift, routine.',
                },
                {
                  title: '2. Asking Questions & Clarifying Information',
                  order: 2,
                  isFree: false,
                  videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                  content:
                    "Key concepts:\n- Question words: What, Where, When, Why, Who, How long.\n- Polite clarification: 'Could you repeat that, please?', 'What do you mean by...?'",
                },
              ],
            },
          },
          {
            title: 'Module 2: Workplace & Professional Communication',
            order: 2,
            lessons: {
              create: [
                {
                  title: '3. Past Simple: Explaining What Happened',
                  order: 1,
                  isFree: false,
                  videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                  content:
                    "Key concepts:\n- Regular vs irregular verbs in context.\n- Reporting progress and status updates: 'I finished the task yesterday', 'We had a sync this morning'.",
                },
                {
                  title: '4. Writing Clear Emails and Messages',
                  order: 2,
                  isFree: false,
                  videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                  content:
                    'Key concepts:\n- Standard greetings and sign-offs.\n- Asking for feedback or help clearly.\n- Practical template for follow-up notes.',
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`Course created: "${course.title}" (slug: ${course.slug})`);
  console.log(
    '✅ The database has been successfully populated with test data!'
  );
}

main()
  .catch(e => {
    console.error('❌ An error during the seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
