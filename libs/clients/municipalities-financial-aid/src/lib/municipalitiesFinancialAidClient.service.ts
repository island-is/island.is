import { Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { ApplicationApi } from '../../gen/fetch'

@Injectable()
export class MunicipalitiesFinancialAidClientService {
  constructor(private applicationApi: ApplicationApi) {}

  applicationApiWithAuth(auth: Auth) {
    return this.applicationApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getApplications(auth: Auth) {
    console.log('HELLOOOOOOOO')
    return await this.applicationApiWithAuth(
      auth,
    ).applicationControllerGetAllForPeriod({
      dateFrom: '2021-01-01',
      dateTo: '2021-12-31',
    })
  }
}
