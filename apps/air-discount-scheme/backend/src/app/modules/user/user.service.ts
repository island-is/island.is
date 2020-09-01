import { Injectable } from '@nestjs/common'

import { ThjodskraUser, Fund } from '@island.is/air-discount-scheme/types'
import { User } from './user.model'
import { FlightService } from '../flight'

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
  constructor(private readonly flightService: FlightService) {}

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
  ): Promise<ThjodskraUser> {
    // TODO: implement from thjodskra
    const users = [
      {
        nationalId,
        firstName: 'Jón',
        middleName: 'Gunnar',
        lastName: 'Jónsson',
        gender: 'kk',
        address: 'Bessastaðir 1',
        postalcode: 225,
        city: 'Álftanes',
      } as ThjodskraUser,
      {
        nationalId: '1234567890',
        firstName: 'Gervimaður',
        middleName: '',
        lastName: 'Afríka',
        gender: 'kvk',
        address: 'Ísabessastaðir 1',
        postalcode: 400,
        city: 'Ísafjörður',
      } as ThjodskraUser,
    ]
    if (nationalId !== '1234567890') {
      return Promise.resolve(users[0])
    }
    return Promise.resolve(users[1])
  }

  getRelations(nationalId: string): Promise<string[]> {
    // TODO: implement from thjodskra
    return Promise.resolve([nationalId, '1234567890'])
  }

  async getFund(user: ThjodskraUser): Promise<Fund> {
    const {
      used,
      unused,
      total,
    } = await this.flightService.countFlightLegsByNationalId(user.nationalId)

    const meetsADSRequirements = this.isADSPostalCode(user.postalcode)

    return {
      nationalId: user.nationalId,
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
