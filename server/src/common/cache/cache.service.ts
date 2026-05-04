import { Inject, Injectable, OnModuleDestroy } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { type Cache } from "cache-manager";
import { createClient, type RedisClientType } from "redis";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CacheService implements OnModuleDestroy {
  private redisClient: RedisClientType;

  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private configService: ConfigService,
  ) {
    this.redisClient = createClient({
      socket: {
        host: this.configService.get('REDIS_HOST') || 'localhost',
        port: Number(this.configService.get('REDIS_PORT')) || 6379,
      },
    });
    this.redisClient.connect();
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }

  async get(key: string) {
    return await this.cacheManager.get(key);
  }

  async set(key: string, value: any, ttl?: number) {
    await this.cacheManager.set(key, value, ttl ?? 1000 * 60);
  }

  async delete(key: string) {
    await this.cacheManager.del(key);
  }

  async deleteWithPattern(pattern: string) {
    const keyvPattern = `keyv::keyv:${pattern}`;
    let cursor = '0';

    do {
      const result = await this.redisClient.scan(cursor, {
        MATCH: keyvPattern,
        COUNT: 100,
      });
      cursor = result.cursor;

      if (result.keys.length > 0) {
        await this.redisClient.del(result.keys);
      }
    } while (cursor !== '0');
  }
}