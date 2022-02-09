import { Injectable, Inject } from '@nestjs/common'
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
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import * as kennitala from 'kennitala'
import { FetchError } from '@island.is/clients/middlewares'

@Injectable()
export class UserService {
  constructor(
    private readonly flightService: FlightService,
    private readonly nationalRegistryService: NationalRegistryService,
    private readonly nationalRegistryIndividualsApi: EinstaklingarApi,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

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

    if (auth) {
      meetsADSRequirements = await this.individualMeetsADSRequirements(
        user,
        auth,
      )
    } else {
      meetsADSRequirements = this.flightService.isADSPostalCode(user.postalcode)
    }

    return {
      credit: meetsADSRequirements ? unused : 0,
      used: used,
      total,
    }
  }

  private async individualMeetsADSRequirements(
    user: NationalRegistryUser,
    auth: AuthUser,
  ): Promise<boolean> {
    if (this.flightService.isADSPostalCode(user.postalcode)) {
      return true
    }

    // Not valid if child is over 18 || We already checked user postal code so we avoid calling forsjaForeldri with same kennitala
    if (
      kennitala.info(user.nationalId).age >= 18 ||
      user.nationalId === auth.nationalId
    ) {
      return false
    }

    // User(child) doesn't live in ADS-postalcodes but is under 18 years
    const custodians = await this.personApiWithAuth(auth)
      .einstaklingarGetForsjaForeldri(<EinstaklingarGetForsjaForeldriRequest>{
        id: auth.nationalId,
        barn: user.nationalId,
      })
      .catch(this.handle404)

    if (custodians === undefined) {
      return false
    }

    for (const custodian of custodians) {
      const personCustodian = await this.nationalRegistryService.getUser(
        custodian,
      )
      if (
        personCustodian &&
        this.flightService.isADSPostalCode(personCustodian.postalcode)
      ) {
        return true
      }
    }
    return false
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
