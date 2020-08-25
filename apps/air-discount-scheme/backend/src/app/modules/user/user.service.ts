import { Injectable } from '@nestjs/common'

import { User } from './user.model'
import { NationalRegistryResponse } from './user.types'
import { FlightService } from '../flight'

@Injectable()
export class UserService {
  constructor(private readonly flightService: FlightService) {}

  private async getUserFromNationalRegistry(
    nationalId: string,
  ): Promise<NationalRegistryResponse> {
    return {
      firstName: 'Jón',
      middleName: 'Gunnar',
      lastName: 'Jónsson',
      gender: 'Male',
      nationalId,
    }
  }

  async getUserInfoByNationalId(nationalId: string): Promise<User> {
    const {
      unused: flightLegsLeft,
    } = await this.flightService.countFlightLegsLeftByNationalId(nationalId)
    const user = await this.getUserFromNationalRegistry(nationalId)
    return new User(user, flightLegsLeft)
  }
}
