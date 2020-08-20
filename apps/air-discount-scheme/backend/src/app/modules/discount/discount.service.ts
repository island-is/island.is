import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common'
import CacheManager from 'cache-manager'
import { Discount } from './discount.model'
import { FlightService } from '../flight'
import { DiscountLimitExceeded, DiscountCodeInvalid } from './discount.error'

const DEFAULT_AVAILABLE_LEGS = 6
const AVAILABLE_FLIGHT_LEGS = {
  '2020': 4,
  '2021': 6,
}

const DISCOUNT_CODE_LENGTH = 8

const ONE_DAY = 24 * 60 * 60

@Injectable()
export class DiscountService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheManager,
    private readonly flightService: FlightService,
  ) {}

  private async getFlightLegsLeft(nationalId: string) {
    const noFlightLegs = await this.flightService.countFlightLegsByNationalId(
      nationalId,
    )

    const currentYear = new Date(Date.now()).getFullYear().toString()
    let availableLegsThisYear = DEFAULT_AVAILABLE_LEGS
    if (Object.keys(AVAILABLE_FLIGHT_LEGS).includes(currentYear)) {
      availableLegsThisYear = AVAILABLE_FLIGHT_LEGS[currentYear]
    }
    const flightLegsLeft = availableLegsThisYear - noFlightLegs
    if (flightLegsLeft <= 0) {
      throw new DiscountLimitExceeded()
    }
    return flightLegsLeft
  }

  private getDiscountCodeCacheKey(discountCode: string) {
    return `discount_code_${discountCode}`
  }

  async findByDiscountCodeAndNationalId(
    discountCode: string,
    nationalId: string,
  ): Promise<Discount> {
    const cacheKey = this.getDiscountCodeCacheKey(discountCode)
    const cacheValue = await this.cacheManager.get(cacheKey)
    if (!cacheValue || cacheValue.nationalId !== nationalId) {
      throw new DiscountCodeInvalid()
    }

    const flightLegsLeft = await this.getFlightLegsLeft(nationalId)
    return new Discount(discountCode, nationalId, flightLegsLeft)
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

    const flightLegsLeft = await this.getFlightLegsLeft(nationalId)
    return new Discount(discountCode, nationalId, flightLegsLeft)
  }
}
