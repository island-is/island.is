import { Injectable } from '@nestjs/common'

import { EinstaklingarApi } from '../../gen/fetch'

@Injectable()
export class NationalRegistryV3ApplicationsClientService {
  constructor(private individualApi: EinstaklingarApi) {}

  async get18YearOlds(): Promise<string[]> {
    // TODO: revert this. Only for dev-deployment test purposes
    return ['0101303019', '0101302399', '0101307789']
    //return await this.individualApi.einstaklingar18IDagGet()
  }
}
