import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../src/generated/prisma/client';
import 'dotenv/config';
import * as bcrypt from 'bcrypt';

const url = process.env.DATABASE_URL!;

const adapter = new PrismaMariaDb(url);

const prisma = new PrismaClient({
  adapter,
});

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

async function main() {
  let hrRole = await prisma.role.findFirst({
    where: { name: 'hr' },
  });

  if (!hrRole) {
    hrRole = await prisma.role.create({
      data: { name: 'hr' },
    });
  }

  const password = await hashPassword('1234');
  const hrUser = await prisma.user.upsert({
    where: { email: 'hr@gmail.com' },
    update: {
      name: 'HR User',
      roleId: hrRole.id,
    },
    create: {
      name: 'HR User',
      email: 'hr@gmail.com',
      password: password,
      roleId: hrRole.id,
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
