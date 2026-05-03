import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  constructor(private configService: ConfigService) {}
  async connect() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');
    if (!supabaseUrl || !supabaseKey) {
      throw new BadRequestException(
        'Supabase URL and Key must be provided in environment variables',
      );
    }
    return createClient(supabaseUrl, supabaseKey);
  }
}
