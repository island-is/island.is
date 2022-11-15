import { uuid } from 'uuidv4'
import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common'

import { Discount, ExplicitCode } from './discount.model'
import { Flight } from '../flight'
import {
  CONNECTING_FLIGHT_GRACE_PERIOD,
  REYKJAVIK_FLIGHT_CODES,
} from '../flight/flight.service'
import { ConnectionDiscountCode } from '@island.is/air-discount-scheme/types'
import { User } from '../user/user.model'
import { InjectModel } from '@nestjs/sequelize'

interface CachedDiscount {
  user: User
  discountCode: string
  connectionDiscountCodes: ConnectionDiscountCode[]
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
  explicitCode: (discountCode: string) =>
    `explicit_code_lookup_${discountCode}`,
}

@Injectable()
export class DiscountService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheManager,

    @InjectModel(ExplicitCode)
    private explicitModel: typeof ExplicitCode,
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
    user: User,
    nationalId: string,
    connectableFlights: Flight[],
  ): Promise<Discount> {
    const discountCode = this.generateDiscountCode()
    const cacheId = CACHE_KEYS.discount(uuid())

    let connectionDiscountCodes: ConnectionDiscountCode[] = []

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
        const flightLegsCount = flight.flightLegs.length
        let validUntil = new Date(
          Date.parse(flight.flightLegs[0].date.toString()),
        )

        if (REYKJAVIK_FLIGHT_CODES.includes(flight.flightLegs[0].origin)) {
          validUntil = new Date(
            validUntil.getTime() + CONNECTING_FLIGHT_GRACE_PERIOD,
          )
        } else if (
          REYKJAVIK_FLIGHT_CODES.includes(
            flight.flightLegs[flightLegsCount - 1].destination,
          )
        ) {
          validUntil = new Date(validUntil.getTime())
        }

        const flightId = flight.id
        const flightDesc = `${flight.flightLegs[0].origin}-${
          flight.flightLegs[flightLegsCount - 1].destination
        }`
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
          validUntil: validUntil.toISOString(),
        })
      }
    }

    // Filter out connectionCodes that are expired in their validity
    const now = new Date(Date.now())
    connectionDiscountCodes = connectionDiscountCodes.filter((cdc) => {
      const validUntil = new Date(Date.parse(cdc.validUntil))

      return now < validUntil
    })

    await this.setCache<CachedDiscount>(cacheId, {
      user,
      nationalId,
      discountCode,
      connectionDiscountCodes,
    })
    await this.setCache<string>(CACHE_KEYS.discountCode(discountCode), cacheId)
    await this.setCache<string>(CACHE_KEYS.user(nationalId), cacheId)

    return new Discount(
      user,
      discountCode,
      connectionDiscountCodes,
      nationalId,
      ONE_DAY,
    )
  }

  async createExplicitDiscountCode(
    user: User,
    nationalId: string,
    connectableFlights: Flight[],
    employeeId: string,
    comment: string,
  ): Promise<Discount> {
    const discount = await this.createDiscountCode(
      user,
      nationalId,
      connectableFlights,
    )

    // Create record of the explicit code
    this.explicitModel.create({
      code: discount.discountCode,
      customerId: nationalId,
      employeeId: employeeId,
      comment,
    })

    // Flag the discount as explicit in the cache
    const cacheId = discount.discountCode
    const cacheKey = CACHE_KEYS.explicitCode(discount.discountCode)
    await this.setCache<string>(cacheKey, cacheId) // cacheId pointer
    await this.setCache<string>(cacheId, discount.discountCode) // cache value

    return discount
  }

  async getDiscountByNationalId(nationalId: string): Promise<Discount | null> {
    const cacheKey = CACHE_KEYS.user(nationalId)
    const cacheValue = await this.getCache<CachedDiscount>(cacheKey)
    if (!cacheValue) {
      return null
    }

    // If the cached discountCode has been used then the nationalId cache
    // is invalid and needs to be regenerated by the resolver
    const discountCodeCacheKey = CACHE_KEYS.discountCode(
      cacheValue.discountCode,
    )
    if (!(await this.getCache<CachedDiscount>(discountCodeCacheKey))) {
      return null
    }

    const ttl = await this.cacheManager.ttl(cacheKey)

    return new Discount(
      cacheValue.user,
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
      return await this.getDiscountByConnectionDiscountCode(discountCode)
    }

    const ttl = await this.cacheManager.ttl(cacheKey)
    return new Discount(
      cacheValue.user,
      discountCode,
      cacheValue.connectionDiscountCodes ?? [],
      cacheValue.nationalId,
      ttl,
    )
  }

  async getDiscountByConnectionDiscountCode(
    discountCode: string,
  ): Promise<Discount | null> {
    const cacheKey = CACHE_KEYS.connectionDiscountCode(discountCode)
    const cacheValue = await this.getCache<CachedDiscount>(cacheKey)

    if (!cacheValue) {
      return null
    }

    const connectionDiscountCode = this.filterConnectionDiscountCodes(
      cacheValue.connectionDiscountCodes,
      discountCode,
    )

    if (!connectionDiscountCode) {
      return null
    }

    const ttl = await this.cacheManager.ttl(cacheKey)
    return new Discount(
      cacheValue.user,
      cacheValue.discountCode,
      cacheValue.connectionDiscountCodes ?? [],
      cacheValue.nationalId,
      ttl,
    )
  }

  filterConnectionDiscountCodes(
    connectionDiscountCodes: ConnectionDiscountCode[],
    discountCode: string,
  ): ConnectionDiscountCode | null {
    // Return nothing if the connection discount code is expired
    const now = new Date(Date.now())
    connectionDiscountCodes = connectionDiscountCodes.filter((cdc) => {
      if (cdc.code === discountCode) {
        const validUntil = new Date(Date.parse(cdc.validUntil))
        return now < validUntil
      } else {
        return false
      }
    })
    if (connectionDiscountCodes.length === 0) {
      return null
    }

    return connectionDiscountCodes[0]
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

      const explicitCacheKey = CACHE_KEYS.explicitCode(discountCode)
      const isExplicit = await this.getCache<string>(explicitCacheKey)

      if (isExplicit) {
        this.explicitModel.update(
          {
            flightId,
          },
          {
            where: {
              code: discountCode,
            },
          },
        )
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

    const cacheValue: CachedDiscount = await this.cacheManager.get(cacheId)
    if (!cacheValue) {
      return
    }

    const ttl = await this.cacheManager.ttl(cacheId)

    // Point the discount code back to the old cache
    await this.setCache<CachedDiscount>(cacheId, cacheValue)
    await this.setCache<string>(
      CACHE_KEYS.discountCode(cacheValue.discountCode),
      cacheId,
      ttl,
    )

    // Move the user lookup pointer to the old cache too
    // TODO: cache is not invalidated entirely on this
    //       deletion endpoint
    await this.setCache<string>(
      CACHE_KEYS.user(cacheValue.nationalId),
      cacheId,
      ttl,
    )
  }
}
