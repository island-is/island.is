import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { Cache } from 'cache-manager'

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get(key): Promise<any> {
    return await this.cache.get(key)
  }

  async set(key, value) {
    await this.cache.set(key, value, 30000)
  }

  async reset() {
    await this.cache.reset()
  }

  async del(key) {
    await this.cache.del(key)
  }
}
