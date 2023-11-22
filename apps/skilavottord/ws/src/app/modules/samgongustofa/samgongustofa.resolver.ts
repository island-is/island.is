import { Query, Resolver, Args } from '@nestjs/graphql'

import { Authorize, CurrentUser, User } from '../auth'

import { VehicleInformation } from './samgongustofa.model'
import { SamgongustofaService } from './samgongustofa.service'

@Authorize()
@Resolver(() => VehicleInformation)
export class SamgongustofaResolver {
  constructor(private samgongustofaService: SamgongustofaService) {}

  @Query(() => [VehicleInformation])
  async skilavottordVehicles(
    @CurrentUser() user: User,
  ): Promise<Array<VehicleInformation>> {
    return this.samgongustofaService.getUserVehiclesInformation(user.nationalId)
  }
}
