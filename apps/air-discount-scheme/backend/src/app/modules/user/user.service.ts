import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common'
import { AirlineUser, User } from './user.model'
import { Fund } from '@island.is/air-discount-scheme/types'
import { FlightService } from '../flight'
import {
  NationalRegistryService,
  NationalRegistryUser,
} from '../nationalRegistry'
import {
  AuthMiddleware,
  AuthMiddlewareOptions,
  User as AuthUser,
} from '@island.is/auth-nest-tools'
import {
  EinstaklingarApi,
  EinstaklingarGetForsjaForeldriRequest,
  EinstaklingarGetForsjaRequest,
} from '@island.is/clients/national-registry-v2'
import environment from '../../../environments/environment'
import * as kennitala from 'kennitala'
import { FetchError } from '@island.is/clients/middlewares'

const ONE_WEEK = 604800 // seconds
const CACHE_KEY = 'userService'
const MAX_AGE_LIMIT = 18

@Injectable()
export class UserService {
  constructor(
    private readonly flightService: FlightService,
    private readonly nationalRegistryService: NationalRegistryService,
    private readonly nationalRegistryIndividualsApi: EinstaklingarApi,
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheManager,
  ) {}

  private getCacheKey(nationalId: string, suffix: 'custodians'): string {
    return `${CACHE_KEY}_${nationalId}_${suffix}`
  }

  personApiWithAuth(authUser: AuthUser) {
    return this.nationalRegistryIndividualsApi.withMiddleware(
      new AuthMiddleware(
        authUser,
        environment.nationalRegistry
          .authMiddlewareOptions as AuthMiddlewareOptions,
      ),
    )
  }

  async getRelations(authUser: AuthUser): Promise<Array<string>> {
    const response = await this.personApiWithAuth(authUser)
      .einstaklingarGetForsja(<EinstaklingarGetForsjaRequest>{
        id: authUser.nationalId,
      })
      .catch(this.handle404)

    if (response === undefined) {
      return []
    }
    return response
  }

  async getCustodians(
    auth: AuthUser,
    childNationalId: string,
  ): Promise<Array<string>> {
    const response = await this.personApiWithAuth(auth)
      .einstaklingarGetForsjaForeldri(<EinstaklingarGetForsjaForeldriRequest>{
        id: auth.nationalId,
        barn: childNationalId,
      })
      .catch(this.handle404)

    if (response === undefined) {
      return []
    }
    return response
  }

  private async getFund(
    user: NationalRegistryUser,
    auth?: AuthUser,
  ): Promise<Fund> {
    const {
      used,
      unused,
      total,
    } = await this.flightService.countThisYearsFlightLegsByNationalId(
      user.nationalId,
    )
    let meetsADSRequirements = false

    if (this.flightService.isADSPostalCode(user.postalcode)) {
      meetsADSRequirements = true
    } else if (kennitala.info(user.nationalId).age < MAX_AGE_LIMIT) {
      // NationalId is a minor and doesn't live in ADS postal codes.
      const cacheKey = this.getCacheKey(user.nationalId, 'custodians')
      const cacheValue = await this.cacheManager.get(cacheKey)
      let custodians = undefined

      if (cacheValue) {
        // We need cache incase we come here from publicApi without auth
        custodians = cacheValue.custodians
      } else if (auth) {
        // We have access to auth if a user is logged in
        custodians = [
          auth.nationalId,
          ...(await this.getCustodians(auth, user.nationalId)),
        ]
        await this.cacheManager.set(cacheKey, { custodians }, { ttl: ONE_WEEK })
      }

      // Check child custodians if they have valid ADS postal code.
      if (custodians) {
        for (const custodian of custodians) {
          const personCustodian = await this.nationalRegistryService.getUser(
            custodian,
          )
          if (
            personCustodian &&
            this.flightService.isADSPostalCode(personCustodian.postalcode)
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
    auth?: AuthUser,
  ): Promise<T | null> {
    const user = await this.nationalRegistryService.getUser(nationalId)
    if (!user) {
      return null
    }
    const fund = await this.getFund(user, auth)
    return new model(user, fund)
  }

  async getAirlineUserInfoByNationalId(
    nationalId: string,
  ): Promise<AirlineUser | null> {
    return this.getUserByNationalId<AirlineUser>(nationalId, AirlineUser)
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

  private handle404(error: FetchError) {
    if (error.status === 404) {
      return undefined
    }
    throw error
  }
}
