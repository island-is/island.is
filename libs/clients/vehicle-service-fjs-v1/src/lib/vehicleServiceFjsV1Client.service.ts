import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { DefaultApi } from '../../gen/fetch/apis'
import { VehicleDebtStatus } from './vehicleServiceFjsV1Client.types'

@Injectable()
export class VehicleServiceFjsV1Client {
  constructor(private readonly defaultApi: DefaultApi) {}

  private defaultApiWithAuth(auth: Auth) {
    return this.defaultApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getVehicleDebtStatus(
    auth: User,
    permno: string,
  ): Promise<VehicleDebtStatus> {
    const result = await this.defaultApiWithAuth(
      auth,
    ).vehicleDebtLesscarNumberGET1({
      carNumber: permno,
    })

    return {
      isDebtLess: result?.debtLessResult?.debtLess,
    }
  }
}
