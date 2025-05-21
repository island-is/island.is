import { Injectable } from '@nestjs/common'

import { BirthdayIndividual, mapBirthdayIndividual } from './mappers'
import {
  EinstaklingarApi,
  HjuskapurDTO,
  IslandIsApi,
  LogheimiliDTO,
} from '../../gen/fetch'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  CohabitationDto,
  formatCohabitationDtoV3FromHju,
  formatCohabitationDtoV3FromSam,
} from './types/cohabitation.dto'

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

  async getSpouse(auth: User): Promise<HjuskapurDTO> {
    return await this.einstaklingarApiWithAuth(
      auth,
    ).einstaklingarKennitalaHjuskapurGet({
      kennitala: auth.nationalId,
    })
  }

  async getCohabitationInfo(
    nationalId: string,
    auth: User,
  ): Promise<CohabitationDto | null> {
    const res = await this.einstaklingarApiWithAuth(
      auth,
    ).einstaklingarKennitalaHjuskapurGet({
      kennitala: nationalId,
    })

    if (res.sambud?.sambud) {
      return formatCohabitationDtoV3FromSam(res.sambud, res.hjuskapur)
    } else if (res.hjuskapur && res.hjuskapur.kennitalaMaka) {
      return formatCohabitationDtoV3FromHju(res.hjuskapur)
    } else {
      return null
    }
  }

  async getLegalResidence(auth: User): Promise<LogheimiliDTO> {
    return await this.einstaklingarApiWithAuth(
      auth,
    ).einstaklingarKennitalaLogheimiliGet({ kennitala: auth.nationalId })
  }
}
