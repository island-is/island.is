import { Injectable } from '@nestjs/common'

import { EinstaklingarApi } from '../../gen/fetch'
import { HjuskapurDTO } from '../../gen/fetch'
@Injectable()
export class NationalRegistryV3ApplicationsClientService {
  constructor(private individualApi: EinstaklingarApi) {}

  async get18YearOlds(): Promise<string[]> {
    return await this.individualApi.einstaklingar18IDagGet()
  }

  async getCohabitationInfo(nationalId: string): Promise<HjuskapurDTO | null> {
    const response = this.individualApi.einstaklingarKennitalaHjuskapurGet({
      kennitala: nationalId,
    })

    return response
  }
}
