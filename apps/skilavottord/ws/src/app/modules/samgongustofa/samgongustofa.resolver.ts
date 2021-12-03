import { Query, Resolver, Args } from '@nestjs/graphql'

import { VehicleInformation } from './samgongustofa.model'
import { SamgongustofaService } from './samgongustofa.service'
import { Authorize } from '../auth'

@Authorize({ throwOnUnAuthorized: false })
@Resolver(() => VehicleInformation)
export class SamgongustofaResolver {
  constructor(private samgongustofaService: SamgongustofaService) {}

  @Query(() => [VehicleInformation])
  async skilavottordVehicles(
    @Args('nationalId') nid: string,
  ): Promise<Array<VehicleInformation>> {
    return this.samgongustofaService.getVehicleInformation(nid)
  }
}
