import { Injectable } from '@nestjs/common'
import { AirlineUser, User } from './user.model'
import { Fund } from '@island.is/air-discount-scheme/types'
import * as kennitala from 'kennitala'
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
  EinstaklingarGetForsjaRequest,
} from '@island.is/clients/national-registry-v2'
import environment from '../../../environments/environment'

@Injectable()
export class UserService {
  constructor(
    private readonly flightService: FlightService,
    private readonly nationalRegistryService: NationalRegistryService,
    private readonly nationalRegistryIndividualsApi: EinstaklingarApi,
  ) {}

  getIndividualsApiWithAuth(authUser: AuthUser) {
    return this.nationalRegistryIndividualsApi.withMiddleware(
      new AuthMiddleware(
        authUser,
        environment.nationalRegistry
          .authMiddlewareOptions as AuthMiddlewareOptions,
      ),
    )
  }

  async getRelations(authUser: AuthUser): Promise<Array<string>> {
    const response = this.getIndividualsApiWithAuth(
      authUser,
    ).einstaklingarGetForsja(<EinstaklingarGetForsjaRequest>{
      id: authUser.nationalId,
    })

    if (Array.isArray(response)) {
      return response
    } else {
      return []
    }
  }

  private async getFund(
    authUser: AuthUser,
    user: NationalRegistryUser,
  ): Promise<Fund> {
    const {
      used,
      unused,
      total,
    } = await this.flightService.countThisYearsFlightLegsByNationalId(
      user.nationalId,
    )

    const meetsADSRequirements = await this.getIndividualMeetsReqs(
      authUser,
      user,
    )

    return {
      credit: meetsADSRequirements ? unused : 0,
      used: used,
      total,
    }
  }

  private async getIndividualMeetsReqs(
    authUser: AuthUser,
    user: NationalRegistryUser,
  ) {
    if (this.flightService.isADSPostalCode(user.postalcode)) {
      return true
    }

    // TODO: check if this is correct?
    if (kennitala.info(user.nationalId).age >= 18) {
      return false
    }

    const api = await this.getIndividualsApiWithAuth(authUser)

    const custodians = await api.einstaklingarGetForsjaForeldri({
      id: authUser.nationalId,
      barn: user.nationalId,
    })

    for (const custodian of custodians) {
      const address = await api.einstaklingarGetLogheimili({ id: custodian })

      if (
        this.flightService.isADSPostalCode(
          parseInt(address.postnumer ?? '0', 10),
        )
      ) {
        return true
      }
    }

    return false
  }

  private async getUserByNationalId<T>(
    authUser: AuthUser,
    nationalId: string,
    model: new (user: NationalRegistryUser, fund: Fund) => T,
  ): Promise<T | null> {
    const user = await this.nationalRegistryService.getUser(nationalId)
    if (!user) {
      return null
    }

    const fund = await this.getFund(authUser, user)
    return new model(user, fund)
  }

  async getAirlineUserInfoByNationalId(
    authUser: AuthUser,
    nationalId: string,
  ): Promise<AirlineUser | null> {
    return this.getUserByNationalId<AirlineUser>(
      authUser,
      nationalId,
      AirlineUser,
    )
  }

  async getUserInfoByNationalId(
    authUser: AuthUser,
    nationalId: string,
  ): Promise<User | null> {
    return this.getUserByNationalId<User>(authUser, nationalId, User)
  }

  async getMultipleUsersByNationalIdArray(
    authUser: AuthUser,
    ids: string[],
  ): Promise<Array<User>> {
    const allUsers = ids.map(async (nationalId) =>
      this.getUserInfoByNationalId(authUser, nationalId),
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
