import { Injectable } from '@nestjs/common'

import { IslandIsApi } from '../../gen/fetch'
import { BirthdayIndividual, mapBirthdayIndividual } from './mappers'

@Injectable()
export class NationalRegistryV3ApplicationsClientService {
  constructor(private islandIsApi: IslandIsApi) {}

  async get18YearOlds(): Promise<Array<BirthdayIndividual>> {
    const res = await this.islandIsApi.islandIs18IDagGet()
    return (res.eins18IDagList ?? []).map(mapBirthdayIndividual)
  }
}
