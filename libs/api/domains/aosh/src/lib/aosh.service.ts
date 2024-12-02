import { Injectable } from '@nestjs/common'
// import { AoshClientService } from '@island.is/clients/energy-funds'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { VehicleMiniDto, VehicleSearchApi } from '@island.is/clients/vehicles'

@Injectable()
export class AoshService {
  constructor(
    // private readonly seminarsClientService: SeminarsClientService,
    private readonly vehiclesApi: VehicleSearchApi,
  ) {}

  // private vehiclesApiWithAuth(auth: Auth) {
  //   return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
  // }
}
