import { Injectable } from '@nestjs/common'
import type { Auth } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import { ApplicationApi } from '../../gen/fetch/apis/ApplicationApi'

@Injectable()
export class FinancialAidService {
  constructor(private applicationApi: ApplicationApi) {}

  applicationApiWithAuth(auth: Auth) {
    return this.applicationApi.withMiddleware(new AuthMiddleware(auth))
  }

  async hasUserApplicationForCurrentPeriod(auth: Auth, nationalId: string) {
    console.log('auth', auth)
    return await this.applicationApiWithAuth(
      auth,
    ).applicationControllerGetCurrentApplication({
      nationalId,
    })
  }
}
