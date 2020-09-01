import { Injectable } from '@nestjs/common'

import { Fund } from '@island.is/air-discount-scheme/types'
import { User } from './user.model'
import { FlightService } from '../flight'
import {
  NationalRegistryService,
  NationalRegistryUser,
} from '../nationalRegistry'

@Injectable()
export class UserService {
  constructor(
    private readonly flightService: FlightService,
    private readonly nationalRegistryService: NationalRegistryService,
  ) {}

  private async getUserFromNationalRegistry(
    nationalId: string,
  ): Promise<NationalRegistryUser> {
    return this.nationalRegistryService.getUser(nationalId)
  }

  getRelations(nationalId: string): Promise<string[]> {
    // TODO: implement from nationalRegistry in "2nd Phase"
    return Promise.resolve([nationalId])
  }

  async getFund(user: NationalRegistryUser): Promise<Fund> {
    const {
      used,
      unused,
      total,
    } = await this.flightService.countFlightLegsByNationalId(user.nationalId)

    const meetsADSRequirements = this.flightService.isADSPostalCode(
      user.postalcode,
    )

    return {
      nationalId: user.nationalId,
      credit: meetsADSRequirements ? unused : 0,
      used: used,
      total,
    }
  }

  async getUserInfoByNationalId(nationalId: string): Promise<User> {
    const user = await this.getUserFromNationalRegistry(nationalId)
    if (!user) {
      return null
    }

    const fund = await this.getFund(user)
    return new User(user, fund)
  }
}
