import { Module } from '@nestjs/common';
import { AbsentsController } from './absent.controller';
import { AbsentsService } from './absent.service';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { SupabaseModule } from 'src/config/supabase/supabase.module';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from 'src/common/cache/cache.module';

@Module({
  imports: [PrismaModule, SupabaseModule, JwtModule, CacheModule],
  controllers: [AbsentsController],
  providers: [AbsentsService],
})
export class AbsentsModule {}
