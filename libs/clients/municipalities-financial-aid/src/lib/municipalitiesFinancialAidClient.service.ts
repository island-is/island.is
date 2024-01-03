import { Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { DefaultApi } from '../../gen/fetch'

@Injectable()
export class MunicipalitiesFinancialAidClientService {
  constructor(private defaultApi: DefaultApi) {}

  private defaultApiWithAuth(auth: Auth) {
    return this.defaultApi.withMiddleware(new AuthMiddleware(auth))
  }

  getApplications(auth: User) {
    console.log('getApplications')
    return
  }
}
