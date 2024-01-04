import { Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApplicationApi } from '../../gen/fetch'

@Injectable()
export class MunicipalitiesFinancialAidClientService {
  constructor(private applicationApi: ApplicationApi) {}

  applicationApiWithAuth(auth: Auth) {
    return this.applicationApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getApplications(auth: Auth) {
    return await this.applicationApiWithAuth(auth).applicationControllerGetAll()
  }
}
