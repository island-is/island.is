import { uuid } from 'uuidv4'
import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common'

import { Discount } from './discount.model'
import { Flight } from '../flight'
import {
  CONNECTING_FLIGHT_GRACE_PERIOD,
  REYKJAVIK_FLIGHT_CODES,
} from '../flight/flight.service'
import { ConnectionDiscountCodes } from '@island.is/air-discount-scheme/types'

interface CachedDiscount {
  discountCode: string
  connectionDiscountCodes: ConnectionDiscountCodes
  nationalId: string
}

export const DISCOUNT_CODE_LENGTH = 8

const ONE_DAY = 24 * 60 * 60

const CACHE_KEYS = {
  user: (nationalId: string) => `discount_user_lookup_${nationalId}`,
  discount: (id: string) => `discount_id_${id}`,
  discountCode: (discountCode: string) =>
    `discount_code_lookup_${discountCode}`,
  connectionDiscountCode: (code: string) => `connection_discount_${code}`,
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
    connectableFlights: Flight[],
  ): Promise<Discount> {
    const discountCode = this.generateDiscountCode()
    const cacheId = CACHE_KEYS.discount(uuid())

    let connectionDiscountCodes: ConnectionDiscountCodes = []

    const previousCacheId = CACHE_KEYS.user(nationalId)
    const previousCache = await this.getCache<CachedDiscount>(previousCacheId)
    let previousFlightIds: string[] = []

    if (previousCache?.connectionDiscountCodes) {
      connectionDiscountCodes = previousCache.connectionDiscountCodes
      previousFlightIds = connectionDiscountCodes.map((cdc) => cdc.flightId)
    }

    const connectableFlightCounts = connectableFlights.length
    // Create a discount code per every new flightId
    for (let i = 0; i < connectableFlightCounts; i++) {
      const flight = connectableFlights.pop()
      if (flight && !previousFlightIds.includes(flight.id)) {
        let validUntil = new Date(
          Date.parse(flight.flightLegs[0].date.toString()),
        )

        if (REYKJAVIK_FLIGHT_CODES.includes(flight.flightLegs[0].origin)) {
          validUntil = new Date(
            validUntil.getTime() + CONNECTING_FLIGHT_GRACE_PERIOD,
          )
        } else if (
          REYKJAVIK_FLIGHT_CODES.includes(flight.flightLegs[0].destination)
        ) {
          validUntil = new Date(
            validUntil.getTime() - CONNECTING_FLIGHT_GRACE_PERIOD,
          )
        }

        const flightId = flight.id
        const flightDesc = `${flight.flightLegs[0].origin}-${flight.flightLegs[0].destination}`
        const connectionDiscountCode = this.generateDiscountCode()

        // Point every connection discount code to the cache id for lookup later
        await this.setCache<string>(
          CACHE_KEYS.connectionDiscountCode(connectionDiscountCode),
          cacheId,
        )

        connectionDiscountCodes.push({
          code: connectionDiscountCode,
          flightId,
          flightDesc,
          validUntil: validUntil.toISOString().split('.')[0].replace('T', ' '),
        })
      }
    }
    await this.setCache<CachedDiscount>(cacheId, {
      nationalId,
      discountCode,
      connectionDiscountCodes,
    })
    await this.setCache<string>(CACHE_KEYS.discountCode(discountCode), cacheId)
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
    let cacheKey = CACHE_KEYS.discountCode(discountCode)
    let cacheValue = await this.getCache<CachedDiscount>(cacheKey)

    if (!cacheValue) {
      // Try searching for a connectingDiscountCode
      cacheKey = CACHE_KEYS.connectionDiscountCode(discountCode)
      cacheValue = await this.getCache<CachedDiscount>(cacheKey)
      if (!cacheValue) {
        return null
      }
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
    const cacheKey = CACHE_KEYS.user(nationalId)
    const cacheValue = await this.getCache<CachedDiscount>(cacheKey)

    if (isConnectionDiscount) {
      if (cacheValue?.connectionDiscountCodes) {
        let markedDiscountCode = null
        for (const connectionDiscountCode of cacheValue.connectionDiscountCodes) {
          if (connectionDiscountCode.code === discountCode) {
            markedDiscountCode = connectionDiscountCode
          }
        }

        // Remove connection discount code from cache if found
        if (markedDiscountCode) {
          cacheValue.connectionDiscountCodes.splice(
            cacheValue.connectionDiscountCodes.indexOf(markedDiscountCode),
            1,
          )
          await this.cacheManager.del(
            CACHE_KEYS.connectionDiscountCode(markedDiscountCode.code),
          )
        }
        await this.setCache<CachedDiscount>(cacheKey, cacheValue)
      }
    } else {
      const discountCacheKey = CACHE_KEYS.discountCode(discountCode)
      const cacheId = await this.cacheManager.get(discountCacheKey)
      await this.cacheManager.del(discountCacheKey)
      if (cacheValue) {
        cacheValue.discountCode = ''
        await this.setCache<CachedDiscount>(cacheKey, cacheValue)
      }

      const ttl = await this.cacheManager.ttl(cacheId)
      await this.setCache<string>(CACHE_KEYS.flight(flightId), cacheId, ttl)
    }
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
