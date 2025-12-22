import { Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { VehicleSearchApi } from '@island.is/clients/vehicles'

import { BasicVehicleInformation } from './graphql/models'

@Injectable()
export class MileCarApi {
  constructor(private readonly vehiclesApi: VehicleSearchApi) {}

  private vehiclesApiWithAuth(auth: Auth) {
    return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getBasicVehicleInfoByPermno(
    auth: User,
    permno: string,
  ): Promise<BasicVehicleInformation | null> {
    try {
      const vehicle = await this.vehiclesApiWithAuth(
        auth,
      ).basicVehicleInformationGet({
        clientPersidno: auth.nationalId,
        permno: permno,
      })

      const model = vehicle.make
      const subModel = vehicle.vehcom ?? ''

      return {
        permno: vehicle.permno,
        make: `${model} ${subModel}`,
        color: vehicle.color,
      }
    } catch (e) {
      return null
    }
  }
}
