import { Injectable } from '@nestjs/common'

import { Einstaklingur18IDagItemDTO, IslandIsApi } from '../../gen/fetch'

@Injectable()
export class NationalRegistryV3ApplicationsClientService {
  constructor(private islandIsApi: IslandIsApi) {}

  async get18YearOlds(): Promise<Array<Einstaklingur18IDagItemDTO>> {
    const res = await this.islandIsApi.islandIs18IDagGet()
    return res.eins18IDagList ?? []
  }
}
