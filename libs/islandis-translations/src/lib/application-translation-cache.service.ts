import { Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache as CacheManager } from 'cache-manager'

import { getApplicationTranslationCacheKey } from './application-translation.cache'

@Injectable()
export class ApplicationTranslationCacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: CacheManager,
  ) {}

  invalidate = async (namespace: string): Promise<void> => {
    await this.cacheManager.del(getApplicationTranslationCacheKey(namespace))
  }
}
