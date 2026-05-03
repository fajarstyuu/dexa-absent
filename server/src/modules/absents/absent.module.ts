import { Module } from '@nestjs/common';
import { AbsentsController } from './absent.controller';
import { AbsentsService } from './absent.service';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { SupabaseModule } from 'src/config/supabase/supabase.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, SupabaseModule, JwtModule],
  controllers: [AbsentsController],
  providers: [AbsentsService],
})
export class AbsentsModule {}
