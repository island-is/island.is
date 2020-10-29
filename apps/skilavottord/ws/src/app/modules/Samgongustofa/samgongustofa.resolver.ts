import { Inject } from '@nestjs/common'
import { Query, Resolver, Args } from '@nestjs/graphql'
import { VehicleInformation, DeRegisterVehicle } from './models'
import { SamgongustofaService } from './models/samgongustofa.service'

@Resolver(() => VehicleInformation)
export class SamgongustofaResolver {
  constructor(
    @Inject(SamgongustofaService)
    private SamgongustofaService: SamgongustofaService,
  ) {}

  @Query(() => [VehicleInformation])
  async SkilavottordgetVehicleInformation(
    @Args('nationalId') nid: string,
  ): Promise<Array<VehicleInformation>> {
    return this.SamgongustofaService.getVehicleInformation(nid)
  }

  @Query(() => DeRegisterVehicle)
  async SkilavottorddeRegisterVehicle(
    @Args('vehiclePermno') nid: string,
  ): Promise<DeRegisterVehicle> {
    return this.SamgongustofaService.deRegisterVehicle(nid)
  }
}
