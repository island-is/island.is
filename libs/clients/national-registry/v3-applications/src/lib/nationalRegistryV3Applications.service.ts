import { Injectable } from '@nestjs/common'
import { EinstaklingarApi } from '../../gen/fetch'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'

@Injectable()
export class NationalRegistryV3ApplicationsClientService {
  constructor(private individualApi: EinstaklingarApi) {}

  private individualApiWithAuth(auth: Auth) {
    return this.individualApi.withMiddleware(new AuthMiddleware(auth))
  }

  async get18YearOlds(): Promise<string[]> {
    // TODO
    // return await this.individualApi.einstaklingar18IDagGet()
    return []
  }

  async getMyCustodians(auth: User): Promise<string[]> {
    const res = await this.individualApiWithAuth(
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
