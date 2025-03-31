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
    return await this.individualApi.einstaklingar18IDagGet()
  }

  async getMyCustodians(auth: User): Promise<string[]> {
    return this.individualApiWithAuth(auth).einstaklingarKennitalaForsjaYfirGet(
      {
        kennitala: auth.nationalId,
      },
    )
  }
}
