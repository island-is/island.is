import { Injectable } from '@nestjs/common'

import { EinstaklingarApi } from '../../gen/fetch'

@Injectable()
export class NationalRegistryV3ApplicationsClientService {
  constructor(private individualApi: EinstaklingarApi) {}

  async get18YearOlds(useFakeData?: boolean): Promise<string[]> {
    if (useFakeData) {
      const day = new Date().getDay() // Sunday - Saturday : 0 - 6
      const birthdaySsn = [
        '0101303019', // Sunday
        '0101302399', // Monday
        '0101307789', // Tuesday
        '0101302989', // Wednesday
        '0101302719', // Thursday
        '0101305069', // Friday
        '0101304929', // Saturday
      ][day]
      return [birthdaySsn]
    }

    return await this.individualApi.einstaklingar18IDagGet()
  }
}
