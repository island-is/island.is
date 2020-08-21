import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common'
import CacheManager from 'cache-manager'

import { Discount } from './discount.model'
import { DiscountCodeInvalid } from './discount.error'

const DISCOUNT_CODE_LENGTH = 8

const ONE_DAY = 24 * 60 * 60

@Injectable()
export class DiscountService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheManager,
  ) {}

  private getDiscountCodeCacheKey(discountCode: string) {
    return `discount_code_${discountCode}`
  }

  private getRandomRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  private generateDiscountCode() {
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
    const cacheKey = this.getDiscountCodeCacheKey(discountCode)
    this.cacheManager.set(cacheKey, { nationalId }, { ttl: ONE_DAY })
    return new Discount(discountCode, nationalId, ONE_DAY)
  }

  async validateDiscount(discountCode: string): Promise<string> {
    const cacheKey = this.getDiscountCodeCacheKey(discountCode)
    const cacheValue = await this.cacheManager.get(cacheKey)
    if (!cacheValue || !cacheValue.nationalId) {
      throw new DiscountCodeInvalid()
    }
    return cacheValue.nationalId
  }

  async useDiscount(discountCode: string): Promise<void> {
    const cacheKey = this.getDiscountCodeCacheKey(discountCode)
    await this.cacheManager.del(cacheKey)
  }
}
