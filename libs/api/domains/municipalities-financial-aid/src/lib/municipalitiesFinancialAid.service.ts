import { Injectable } from '@nestjs/common'
import type { Auth } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import { ApplicationApi } from '@island.is/clients/municipalities-financial-aid'

@Injectable()
export class MunicipalitiesFinancialAidService {
  constructor(private applicationApi: ApplicationApi) {}

  applicationApiWithAuth(auth: Auth) {
    return this.applicationApi.withMiddleware(new AuthMiddleware(auth))
  }

  async municipalitiesFinancialAidCurrentApplication(
    auth: Auth,
    nationalId: string,
  ) {
    return await this.applicationApiWithAuth(
      auth,
    ).applicationControllerGetCurrentApplication({
      nationalId,
    })
  }
}
