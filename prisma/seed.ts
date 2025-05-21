import { PrismaClient } from '@prisma/client';

const Prisma = new PrismaClient();

async function main() {
  await Prisma.task.createMany({
    data: [{ title: 'Task 1' }, { title: 'Task 2' }, { title: 'Task 3' }],
  });

  // eslint-disable-next-line no-console
  console.log('Seed completed successfully 🌱🚀');
}
main()
  .then(async () => {
    await Prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);

    await Prisma.$disconnect();

    process.exit(1);
  });
