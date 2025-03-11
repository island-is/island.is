import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { ApiStadfangSearchGetRequest, StadfangApi } from '../../gen/fetch'
import { handle204 } from '@island.is/clients/middlewares'

@Injectable()
export class HmsService {
  constructor(private readonly stadfangApi: StadfangApi) {}

  private apiWithAuth = (user: User) =>
    this.stadfangApi.withMiddleware(new AuthMiddleware(user as Auth))

  async hmsSearch(user: User, input: ApiStadfangSearchGetRequest) {
    const res = await handle204(
      this.apiWithAuth(user).apiStadfangSearchGetRaw(input),
    )

    if (!res) {
      return null
    }

    return res.map((item) => {
      return {
        addressCode: item.stadfangNr,
        address: item.stadfangBirting,
        municipalityName: item.sveitarfelagNafn,
        municipalityCode: item.sveitarfelagNr,
        postalCode: item.postnumer,
        landCode: item.landeignNr,
        streetName: item.stadvisir,
        streetNumber: item.stadgreinirNr,
      }
    })
  }
}
