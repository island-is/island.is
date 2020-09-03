import { Injectable } from '@nestjs/common'
import kennitala from 'kennitala'

import { Fund } from '@island.is/air-discount-scheme/types'
import { User } from './user.model'
import { FlightService } from '../flight'
import {
  NationalRegistryService,
  NationalRegistryUser,
} from '../nationalRegistry'

const MAX_AGE_LIMIT = 18
const ONE_YEAR = 24 * 3600 * 365.25 * 1000

@Injectable()
export class UserService {
  constructor(
    private readonly flightService: FlightService,
    private readonly nationalRegistryService: NationalRegistryService,
  ) {}

  private getAge(birthday: string): number {
    return Math.floor(
      (new Date().getTime() - new Date(birthday).getTime()) / ONE_YEAR,
    )
  }

  async getRelations(nationalId: string): Promise<string[]> {
    const family = await this.nationalRegistryService.getFamily(nationalId)
    return family.reduce((acc, memberNationalId) => {
      if (memberNationalId === nationalId) {
        return [memberNationalId, ...acc]
      } else if (
        this.getAge(kennitala.info(memberNationalId).birthday) < MAX_AGE_LIMIT
      ) {
        return [...acc, memberNationalId]
      }
      return acc
    }, [])
  }

  private async getFund(user: NationalRegistryUser): Promise<Fund> {
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
    const user = await this.nationalRegistryService.getUser(nationalId)
    if (!user) {
      return null
    }

    const fund = await this.getFund(user)
    return new User(user, fund)
  }
}
