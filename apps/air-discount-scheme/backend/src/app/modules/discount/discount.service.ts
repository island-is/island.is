import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common'
import CacheManager from 'cache-manager'

import { Discount } from './discount.model'
import { DiscountCodeInvalid } from './discount.error'
import { FlightService } from '../flight'

const DISCOUNT_CODE_LENGTH = 8

const ONE_DAY = 24 * 60 * 60

@Injectable()
export class DiscountService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheManager,
    private readonly flightService: FlightService,
  ) {}

  private async generateDiscount(
    discountCode: string,
    nationalId: string,
    expires: number,
  ): Promise<Discount> {
    const flightLegsLeft = await this.flightService.countFlightLegsLeftByNationalId(
      nationalId,
    )

    return new Discount(discountCode, nationalId, expires, flightLegsLeft)
  }

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
    return this.generateDiscount(discountCode, nationalId, ONE_DAY)
  }

  async getDiscountByNationalId(nationalId: string): Promise<Discount> {
    const cacheKey = this.getNationalIdCacheKey(nationalId)
    const cacheValue = await this.cacheManager.get(cacheKey)
    if (!cacheValue) {
      return null
    }

    const ttl = await this.cacheManager.ttl(cacheKey)
    return this.generateDiscount(cacheValue.discountCode, nationalId, ttl)
  }

  async getDiscountByDiscountCode(discountCode: string): Promise<Discount> {
    const cacheKey = this.getDiscountCodeCacheKey(discountCode)
    const cacheValue = await this.cacheManager.get(cacheKey)
    if (!cacheValue) {
      return null
    }

    const ttl = await this.cacheManager.ttl(cacheKey)
    return this.generateDiscount(discountCode, cacheValue.nationalId, ttl)
  }

  async validateDiscount(discountCode: string): Promise<string> {
    const discount = await this.getDiscountByDiscountCode(discountCode)
    if (!discount) {
      throw new DiscountCodeInvalid()
    }
    return discount.nationalId
  }

  useDiscount(discountCode: string): Promise<void> {
    const cacheKey = this.getDiscountCodeCacheKey(discountCode)
    return this.cacheManager.del(cacheKey)
  }
}
