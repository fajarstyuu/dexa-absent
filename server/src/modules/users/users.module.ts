import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { BcryptModule } from 'src/common/bcrypt/bcrypt.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, BcryptModule, JwtModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
