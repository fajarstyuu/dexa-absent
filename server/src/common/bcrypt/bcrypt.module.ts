import { Module } from '@nestjs/common';
import { BcryptService } from './bcypt.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [BcryptService],
  exports: [BcryptService],
})
export class BcryptModule {}
