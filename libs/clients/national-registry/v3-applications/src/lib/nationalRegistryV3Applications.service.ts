import { Injectable } from '@nestjs/common'

import { BirthdayIndividual, mapBirthdayIndividual } from './mappers'
import { EinstaklingarApi, IslandIsApi } from '../../gen/fetch'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'

@Injectable()
export class NationalRegistryV3ApplicationsClientService {
  constructor(
    private islandIsApi: IslandIsApi,
    private einstaklingarApi: EinstaklingarApi,
  ) {}

  private einstaklingarApiWithAuth(auth: Auth) {
    return this.einstaklingarApi.withMiddleware(new AuthMiddleware(auth))
  }

  async get18YearOlds(): Promise<Array<BirthdayIndividual>> {
    const res = await this.islandIsApi.islandIs18IDagGet()
    return (res.eins18IDagList ?? []).map(mapBirthdayIndividual)
  }

  async getMyCustodians(auth: User): Promise<string[]> {
    const res = await this.einstaklingarApiWithAuth(
      auth,
    ).einstaklingarKennitalaForsjaYfirGet({
      kennitala: auth.nationalId,
    })

    return (
      res.forsjaAdilarList?.map((x) => x.forsjaKt || '')?.filter((x) => !!x) ||
      []
    )
  }
}
