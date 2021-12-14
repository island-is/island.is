import { Query, Resolver } from '@nestjs/graphql'

import { VehicleInformation } from './samgongustofa.model'
import { SamgongustofaService } from './samgongustofa.service'
import { Authorize, CurrentUser } from '../auth'
import type { AuthUser } from '../auth'

@Authorize({ throwOnUnAuthorized: false })
@Resolver(() => VehicleInformation)
export class SamgongustofaResolver {
  constructor(private samgongustofaService: SamgongustofaService) {}

  @Query(() => [VehicleInformation])
  async skilavottordVehicles(
    @CurrentUser() user: AuthUser,
  ): Promise<Array<VehicleInformation>> {
    return this.samgongustofaService.getVehicleInformation(user.nationalId)
  }
}
