import { Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { VehicleMiniDto } from '@island.is/clients/vehicles'
import format from 'date-fns/format'
import { DefaultApi } from '../../gen/fetch'

const importCodeList = {
  NEWCAR: ['2', '4'],
  USEDCAR: ['1'],
}

@Injectable()
export class MunicipalitiesFinancialAidClientService {
  constructor(private defaultApi: DefaultApi) {}

  private defaultApiWithAuth(auth: Auth) {
    return this.defaultApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getApplications(auth: User, vehicle: VehicleMiniDto) {
    console.log('getApplications')
    return
  }
}
