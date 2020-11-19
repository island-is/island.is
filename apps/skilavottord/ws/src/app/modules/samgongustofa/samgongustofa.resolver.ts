import { Inject } from '@nestjs/common'
import { Query, Resolver, Args } from '@nestjs/graphql'
import { VehicleInformation } from './models'
import { SamgongustofaService } from './models/samgongustofa.service'
import { Authorize } from '../auth'

@Resolver(() => VehicleInformation)
export class SamgongustofaResolver {
  constructor(
    @Inject(SamgongustofaService)
    private samgongustofaService: SamgongustofaService,
  ) {}

  @Authorize({ throwOnUnAuthorized: false })
  @Query(() => [VehicleInformation])
  async skilavottordVehicles(
    @Args('nationalId') nid: string,
  ): Promise<Array<VehicleInformation>> {
    return this.samgongustofaService.getVehicleInformation(nid)
  }
}
