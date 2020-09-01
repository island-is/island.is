import { Injectable, NotFoundException } from '@nestjs/common'

import { Fund } from '@island.is/air-discount-scheme/types'
import { User } from './user.model'
import { FlightService } from '../flight'
import {
  NationalRegistryService,
  NationalRegistryUser,
} from '../nationalRegistry'

const ADS_POSTAL_CODES = {
  Reykhólahreppur: 380,
  // from Reykhólahreppur to Þingeyri
  Þingeyri: 471,

  Hólmavík: 510,
  // from Hólmavík to Öræfi
  Öræfi: 785,

  Vestmannaeyjar: 900,
}

@Injectable()
export class UserService {
  constructor(
    private readonly flightService: FlightService,
    private readonly nationalRegistryService: NationalRegistryService,
  ) {}

  private isADSPostalCode(postalcode: number): boolean {
    if (
      postalcode >= ADS_POSTAL_CODES['Reykhólahreppur'] &&
      postalcode <= ADS_POSTAL_CODES['Þingeyri']
    ) {
      return true
    } else if (
      postalcode >= ADS_POSTAL_CODES['Hólmavík'] &&
      postalcode <= ADS_POSTAL_CODES['Öræfi']
    ) {
      return true
    } else if (postalcode === ADS_POSTAL_CODES['Vestmannaeyjar']) {
      return true
    }
    return false
  }

  private async getUserFromNationalRegistry(
    nationalId: string,
  ): Promise<NationalRegistryUser> {
    const user = await this.nationalRegistryService.getUser(nationalId)
    if (!user) {
      throw new NotFoundException(`User<${nationalId} not found`)
    }

    return user
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
    } = await this.flightService.countFlightLegsByNationalId(user.ssn)

    const meetsADSRequirements = this.isADSPostalCode(user.postalcode)

    return {
      nationalId: user.ssn,
      credit: meetsADSRequirements ? unused : 0,
      used: used,
      total,
    }
  }

  async getUserInfoByNationalId(nationalId: string): Promise<User> {
    const user = await this.getUserFromNationalRegistry(nationalId)
    const fund = await this.getFund(user)
    return new User(user, fund)
  }
}
