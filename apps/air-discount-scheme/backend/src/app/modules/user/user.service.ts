import { Injectable } from '@nestjs/common'

import { ThjodskraUser, Fund } from '@island.is/air-discount-scheme/types'
import { User } from './user.model'
import { NationalRegistryResponse } from './user.types'
import { FlightService } from '../flight'

@Injectable()
export class UserService {
  constructor(private readonly flightService: FlightService) {}

  private async getUserFromNationalRegistry(
    nationalId: string,
  ): Promise<NationalRegistryResponse> {
  meetsADSRequirements(postalcode: number): boolean {
    return ADS_POSTAL_CODES.includes(postalcode)
  }

  async getFund(user: ThjodskraUser): Promise<Fund> {
    const {
      used,
      unused,
      total,
    } = await this.flightService.countFlightLegsByNationalId(user.nationalId)

    return {
      nationalId: user.nationalId,
      credit: this.meetsADSRequirements(user.postalcode) ? unused : 0,
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
