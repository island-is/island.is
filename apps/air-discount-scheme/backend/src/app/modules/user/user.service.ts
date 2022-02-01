import { Injectable } from '@nestjs/common'
import { AirlineUser, User } from './user.model'
import { Fund } from '@island.is/air-discount-scheme/types'
import { FlightService } from '../flight'
import {
  NationalRegistryService,
  NationalRegistryUser,
} from '../nationalRegistry'
// import {
//   AuthMiddleware,
//   AuthMiddlewareOptions,
//   User as AuthUser,
// } from '@island.is/auth-nest-tools'
// import {
//   EinstaklingarApi,
//   EinstaklingarGetForsjaRequest,
// } from '@island.is/clients/national-registry-v2'
import environment from '../../../environments/environment'

@Injectable()
export class UserService {
  constructor(
    private readonly flightService: FlightService,
    private readonly nationalRegistryService: NationalRegistryService,
  ) {}

  async getRelations(nationalId: string): Promise<string[]> {
    return this.nationalRegistryService.getRelatedChildren(nationalId)
  }

  private async getFund(user: NationalRegistryUser): Promise<Fund> {
    const {
      used,
      unused,
      total,
    } = await this.flightService.countThisYearsFlightLegsByNationalId(
      user.nationalId,
    )

    const meetsADSRequirements = this.flightService.isADSPostalCode(
      user.postalcode,
    )

    return {
      credit: meetsADSRequirements ? unused : 0,
      used: used,
      total,
    }
  }

  private async getUserByNationalId<T>(
    nationalId: string,
    model: new (user: NationalRegistryUser, fund: Fund) => T,
  ): Promise<T | null> {
    const user = await this.nationalRegistryService.getUser(nationalId)
    if (!user) {
      return null
    }

    const fund = await this.getFund(user)
    return new model(user, fund)
  }

  async getAirlineUserInfoByNationalId(
    nationalId: string,
  ): Promise<AirlineUser | null> {
    return this.getUserByNationalId<AirlineUser>(nationalId, AirlineUser)
  }

  async getUserInfoByNationalId(nationalId: string): Promise<User | null> {
    return this.getUserByNationalId<User>(nationalId, User)
  }
}
