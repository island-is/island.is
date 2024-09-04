import { Args, Query, Resolver } from '@nestjs/graphql'
import { Authorize, CurrentUser, User } from '../auth'
import { Traffic, VehicleInformation } from './samgongustofa.model'
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

  @Query(() => Traffic)
  async skilavottordTraffic(
    @CurrentUser() user: User,
    @Args('permno') permno: string,
  ): Promise<Traffic> {
    return this.samgongustofaService.getTraffic(permno)
  }
}
