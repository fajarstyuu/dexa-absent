import { PrismaClient } from '@prisma/client/extension';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  // Seed roles first, then users and related records.
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: { name: 'user' },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@dexa.local' },
    update: {
      name: 'Admin',
      roleId: adminRole.id,
    },
    create: {
      name: 'Admin',
      email: 'admin@dexa.local',
      password: 'admin123',
      roleId: adminRole.id,
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: 'user@dexa.local' },
    update: {
      name: 'Demo User',
      roleId: userRole.id,
    },
    create: {
      name: 'Demo User',
      email: 'user@dexa.local',
      password: 'user123',
      roleId: userRole.id,
    },
  });

  const adminAbsent = await prisma.absent.upsert({
    where: { id: 1 },
    update: {
      userId: adminUser.id,
      checkIn: new Date('2026-05-01T08:00:00.000Z'),
      checkOut: new Date('2026-05-01T17:00:00.000Z'),
    },
    create: {
      userId: adminUser.id,
      checkIn: new Date('2026-05-01T08:00:00.000Z'),
      checkOut: new Date('2026-05-01T17:00:00.000Z'),
      pictures: {
        create: [
          { filePath: '/uploads/absents/admin-1.jpg' },
          { filePath: '/uploads/absents/admin-2.jpg' },
        ],
      },
    },
  });

  await prisma.absent.upsert({
    where: { id: adminAbsent.id + 1 },
    update: {
      userId: demoUser.id,
      checkIn: new Date('2026-05-01T09:15:00.000Z'),
      checkOut: null,
    },
    create: {
      userId: demoUser.id,
      checkIn: new Date('2026-05-01T09:15:00.000Z'),
      checkOut: null,
      pictures: {
        create: [{ filePath: '/uploads/absents/user-1.jpg' }],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
