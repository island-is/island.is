import { uuid } from 'uuidv4'
import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common'

import { Discount } from './discount.model'

interface CachedDiscount {
  discountCode: string
  connectionDiscountCodes: { code: string; flightId: string }[]
  nationalId: string
}

export const DISCOUNT_CODE_LENGTH = 8

const ONE_DAY = 24 * 60 * 60

const CACHE_KEYS = {
  user: (nationalId: string) => `discount_user_lookup_${nationalId}`,
  discount: (id: string) => `discount_id_${id}`,
  discountCode: (discountCode: string) =>
    `discount_code_lookup_${discountCode}`,
  connectionDiscountCodes: (
    connectionDiscountCodes: { code: string; flightId: string }[],
  ) => `connection_discount_code_lookup_${connectionDiscountCodes}`,
  flight: (flightId: string) => `discount_flight_lookup_${flightId}`,
}

@Injectable()
export class DiscountService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheManager,
  ) {}

  private getRandomRange(min: number, max: number): number {
    return Math.random() * (max + 1 - min) + min
  }

  private generateDiscountCode(): string {
    return [...Array(DISCOUNT_CODE_LENGTH)]
      .map(() => {
        // We are excluding 0 and O because users mix them up
        const charCodes = [
          this.getRandomRange(49, 57), // 1 - 9
          this.getRandomRange(65, 78), // A - N
          this.getRandomRange(80, 90), // P - Z
        ]
        const randomCharCode =
          charCodes[Math.floor(Math.random() * charCodes.length)]
        return String.fromCharCode(randomCharCode)
      })
      .join('')
  }

  private async setCache<T>(
    key: string,
    value: T,
    ttl: number = ONE_DAY,
  ): Promise<void> {
    return this.cacheManager.set(key, value, { ttl })
  }

  private async getCache<T>(cacheKey: string): Promise<T | null> {
    const cacheId = await this.cacheManager.get(cacheKey)
    if (!cacheId) {
      return null
    }

    return this.cacheManager.get(cacheId)
  }

  async createDiscountCode(
    nationalId: string,
    connectedFlightCounts: number,
    flightIds: string[],
  ): Promise<Discount> {
    const discountCode = this.generateDiscountCode()
    const connectionDiscountCodes: { code: string; flightId: string }[] = []

    for (let i = 0; i < connectedFlightCounts; i++) {
      const flightId = flightIds.pop()
      if (flightId) {
        connectionDiscountCodes.push({
          code: this.generateDiscountCode(),
          flightId: flightId,
        })
      }
    }
    const cacheId = CACHE_KEYS.discount(uuid())
    await this.setCache<CachedDiscount>(cacheId, {
      nationalId,
      discountCode,
      connectionDiscountCodes,
    })
    await this.setCache<string>(CACHE_KEYS.discountCode(discountCode), cacheId)
    await this.setCache<string>(
      CACHE_KEYS.connectionDiscountCodes(connectionDiscountCodes),
      cacheId,
    )
    await this.setCache<string>(CACHE_KEYS.user(nationalId), cacheId)
    return new Discount(
      discountCode,
      connectionDiscountCodes,
      nationalId,
      ONE_DAY,
    )
  }

  async getDiscountByNationalId(nationalId: string): Promise<Discount | null> {
    const cacheKey = CACHE_KEYS.user(nationalId)
    const cacheValue = await this.getCache<CachedDiscount>(cacheKey)
    if (!cacheValue) {
      return null
    }

    const ttl = await this.cacheManager.ttl(cacheKey)
    return new Discount(
      cacheValue.discountCode,
      cacheValue.connectionDiscountCodes ?? [],
      nationalId,
      ttl,
    )
  }

  async getDiscountByDiscountCode(
    discountCode: string,
  ): Promise<Discount | null> {
    const cacheKey = CACHE_KEYS.discountCode(discountCode)
    const cacheValue = await this.getCache<CachedDiscount>(cacheKey)
    if (!cacheValue) {
      return null
    }

    const ttl = await this.cacheManager.ttl(cacheKey)
    return new Discount(
      discountCode,
      cacheValue.connectionDiscountCodes ?? [],
      cacheValue.nationalId,
      ttl,
    )
  }

  async useDiscount(
    discountCode: string,
    nationalId: string,
    flightId: string,
    isConnectionDiscount: boolean,
  ): Promise<void> {
    const userCacheKey = CACHE_KEYS.user(nationalId)
    const cacheValue = await this.getCache<CachedDiscount>(userCacheKey)
    const discountCodeCacheKey = CACHE_KEYS.discountCode(discountCode)
    let connectionDiscountCodeCacheKey: {
      code: string
      flightId: string
    }[] = []
    if (cacheValue?.connectionDiscountCodes) {
      let markedDiscountCode = null
      for (const connectionDiscountCode of cacheValue.connectionDiscountCodes) {
        if (connectionDiscountCode.code === discountCode) {
          markedDiscountCode = connectionDiscountCode
        }
      }
      connectionDiscountCodeCacheKey = cacheValue.connectionDiscountCodes

      if (markedDiscountCode) {
        connectionDiscountCodeCacheKey.splice(
          connectionDiscountCodeCacheKey.indexOf(markedDiscountCode),
          1,
        )
      }
    }
    const cacheId = await this.cacheManager.get(discountCodeCacheKey)
    const ttl = await this.cacheManager.ttl(cacheId)
    if (isConnectionDiscount) {
      await this.setCache<string>(
        CACHE_KEYS.connectionDiscountCodes(connectionDiscountCodeCacheKey),
        cacheId,
        ttl,
      )
    } else {
      await this.cacheManager.del(discountCodeCacheKey)
      await this.cacheManager.del(CACHE_KEYS.user(nationalId))
    }

    await this.setCache<string>(CACHE_KEYS.flight(flightId), cacheId, ttl)
  }
  // When an airline booking has a payment failure, they have already registered
  // the flight with us and used the discount. To avoid making the user get a
  // new discount, we reactivate the discount here only if the flight is
  // cancelled before the ttl on the discount code expires.
  async reactivateDiscount(flightId: string): Promise<void> {
    const usedDiscountCacheKey = CACHE_KEYS.flight(flightId)
    const cacheId = await this.cacheManager.get(usedDiscountCacheKey)
    if (!cacheId) {
      return
    }
    await this.cacheManager.del(usedDiscountCacheKey)

    const cacheValue = await this.cacheManager.get(cacheId)
    if (!cacheValue) {
      return
    }
    const ttl = await this.cacheManager.ttl(cacheId)
    await this.setCache<string>(
      CACHE_KEYS.discountCode(cacheValue.discountCode),
      cacheId,
      ttl,
    )
  }
}
