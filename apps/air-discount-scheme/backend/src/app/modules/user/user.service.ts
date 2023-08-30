import { Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache as CacheManager } from 'cache-manager'
import { User } from './user.model'
import { Fund } from '@island.is/air-discount-scheme/types'
import { FlightService } from '../flight'
import {
  NationalRegistryService,
  NationalRegistryUser,
} from '../nationalRegistry'
import type { User as AuthUser } from '@island.is/auth-nest-tools'
import { info } from 'kennitala'

const ONE_WEEK = 604800 // seconds
const CACHE_KEY = 'userService'
const MAX_AGE_LIMIT = 18

interface CustodianCache {
  custodians: Array<NationalRegistryUser | null>
}

@Injectable()
export class UserService {
  constructor(
    private readonly flightService: FlightService,
    private readonly nationalRegistryService: NationalRegistryService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheManager,
  ) {}

  private getCacheKey(nationalId: string, suffix: 'custodians'): string {
    return `${CACHE_KEY}_${nationalId}_${suffix}`
  }

  async getRelations(authUser: AuthUser): Promise<Array<string>> {
    return this.nationalRegistryService.getRelations(authUser)
  }

  private async getFund(
    user: NationalRegistryUser,
    auth?: AuthUser,
  ): Promise<Fund> {
    const { used, unused, total } =
      await this.flightService.countThisYearsFlightLegsByNationalId(
        user.nationalId,
      )
    let meetsADSRequirements = false

    if (this.flightService.isADSPostalCode(user.postalcode)) {
      meetsADSRequirements = true
    } else if (info(user.nationalId).age < MAX_AGE_LIMIT) {
      // NationalId is a minor and doesn't live in ADS postal codes.
      const cacheKey = this.getCacheKey(user.nationalId, 'custodians')
      const cacheValue = await this.cacheManager.get<CustodianCache>(cacheKey)
      let custodians = undefined

      if (cacheValue) {
        // We need cache incase we come here from publicApi without auth
        custodians = cacheValue.custodians
      } else if (auth) {
        // We have access to auth if a user is logged in
        custodians = [
          ...(await this.nationalRegistryService.getCustodians(
            auth,
            user.nationalId,
          )),
        ]
        await this.cacheManager.set(cacheKey, { custodians }, ONE_WEEK * 1000)
      }

      // Check child custodians if they have valid ADS postal code.
      if (custodians) {
        for (const custodian of custodians) {
          if (
            custodian &&
            this.flightService.isADSPostalCode(custodian.postalcode)
          ) {
            meetsADSRequirements = true
          }
        }
      }
    }

    return {
      credit: meetsADSRequirements ? unused : 0,
      used: used,
      total,
    }
  }

  private async getUserByNationalId<T>(
    nationalId: string,
    model: new (user: NationalRegistryUser, fund: Fund) => T,
    auth: AuthUser,
  ): Promise<T | null> {
    const user = await this.nationalRegistryService.getUser(nationalId, auth)
    if (!user) {
      return null
    }
    const fund = await this.getFund(user, auth)
    return new model(user, fund)
  }

  async getUserInfoByNationalId(
    nationalId: string,
    auth: AuthUser,
  ): Promise<User | null> {
    return this.getUserByNationalId<User>(nationalId, User, auth)
  }

  async getMultipleUsersByNationalIdArray(
    ids: string[],
    auth: AuthUser,
  ): Promise<Array<User>> {
    const allUsers = ids.map(async (nationalId) =>
      this.getUserInfoByNationalId(nationalId, auth),
    )

    const result = (await Promise.all(allUsers)).filter(Boolean) as Array<User>

    if (!result || result.length === 0) {
      throw new Error(
        'Could not find NationalRegistry records of neither User or relatives.',
      )
    }

    return result
  }
}
