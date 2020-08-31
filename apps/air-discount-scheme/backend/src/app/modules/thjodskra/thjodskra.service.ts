import { Inject, Injectable, CACHE_MANAGER, HttpService } from '@nestjs/common'
import CacheManager from 'cache-manager'

import { ThjodskraUser } from './thjodskra.types'
import { environment } from '../../../environments'

const { thjodskra } = environment
const ONE_MONTH = 2592000 // seconds
const CACHE_KEY = 'thjodskra_user'

@Injectable()
export class ThjodskraService {
  constructor(
    private httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheManager,
  ) {}

  private getCacheKey(nationalId: string): string {
    return `${CACHE_KEY}_${nationalId}`
  }

  async getUser(nationalId: string): Promise<ThjodskraUser> {
    const cacheKey = this.getCacheKey(nationalId)
    const cacheValue = await this.cacheManager.get(cacheKey)
    if (cacheValue) {
      return cacheValue.user
    }

    const response = await this.httpService
      .get(`${thjodskra.url}/general-lookup?ssn=${nationalId}`)
      .toPromise()

    const user = response.data[0]
    if (user) {
      await this.cacheManager.set(cacheKey, { user }, { ttl: ONE_MONTH })
    }

    return user
  }
}
