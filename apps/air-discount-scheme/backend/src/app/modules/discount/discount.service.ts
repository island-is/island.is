import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common'
import CacheManager from 'cache-manager'

import { Discount } from './discount.model'

export const DISCOUNT_CODE_LENGTH = 8

const ONE_DAY = 24 * 60 * 60

@Injectable()
export class DiscountService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheManager,
  ) {}

  private getNationalIdCacheKey(nationalId: string): string {
    return `national_id_${nationalId}`
  }

  private getDiscountCodeCacheKey(discountCode: string): string {
    return `discount_code_${discountCode}`
  }

  private getRandomRange(min: number, max: number): number {
    return Math.random() * (max - min) + min
  }

  private generateDiscountCode(): string {
    return [...Array(DISCOUNT_CODE_LENGTH)]
      .map(() => {
        const rand = Math.round(Math.random())
        const digits = this.getRandomRange(48, 57)
        const upperLetters = this.getRandomRange(65, 90)
        return String.fromCharCode(rand > 0.5 ? upperLetters : digits)
      })
      .join('')
  }

  async createDiscountCode(nationalId: string): Promise<Discount> {
    const discountCode = this.generateDiscountCode()
    const discountCodeCacheKey = this.getDiscountCodeCacheKey(discountCode)
    const nationalIdCacheKey = this.getNationalIdCacheKey(nationalId)
    await this.cacheManager.set(
      discountCodeCacheKey,
      { nationalId },
      { ttl: ONE_DAY },
    )
    await this.cacheManager.set(
      nationalIdCacheKey,
      { discountCode },
      { ttl: ONE_DAY },
    )
    return new Discount(discountCode, nationalId, ONE_DAY)
  }

  async getDiscountByNationalId(nationalId: string): Promise<Discount> {
    const cacheKey = this.getNationalIdCacheKey(nationalId)
    const cacheValue = await this.cacheManager.get(cacheKey)
    if (!cacheValue) {
      return null
    }

    const ttl = await this.cacheManager.ttl(cacheKey)
    return new Discount(cacheValue.discountCode, nationalId, ttl)
  }

  async getDiscountByDiscountCode(discountCode: string): Promise<Discount> {
    const cacheKey = this.getDiscountCodeCacheKey(discountCode)
    const cacheValue = await this.cacheManager.get(cacheKey)
    if (!cacheValue) {
      return null
    }

    const ttl = await this.cacheManager.ttl(cacheKey)
    return new Discount(discountCode, cacheValue.nationalId, ttl)
  }

  async useDiscount(discountCode: string, nationalId: string): Promise<void> {
    const discountCodeCacheKey = this.getDiscountCodeCacheKey(discountCode)
    const nationalIdCacheKey = this.getNationalIdCacheKey(nationalId)
    await this.cacheManager.del(discountCodeCacheKey)
    await this.cacheManager.del(nationalIdCacheKey)
  }
}
