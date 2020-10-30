import { Inject } from '@nestjs/common'
import { Query, Resolver, Args } from '@nestjs/graphql'
import { VehicleInformation, DeRegisterVehicle } from './models'
import { SamgongustofaService } from './models/samgongustofa.service'

@Resolver(() => VehicleInformation)
export class SamgongustofaResolver {
  constructor(
    @Inject(SamgongustofaService)
    private samgongustofaService: SamgongustofaService,
  ) {}

  @Query(() => [VehicleInformation])
  async skilavottordVehicles(
    @Args('nationalId') nid: string,
  ): Promise<Array<VehicleInformation>> {
    return this.samgongustofaService.getVehicleInformation(nid)
  }

  @Query(() => DeRegisterVehicle)
  async skilavottordDeRegisterVehicle(
    @Args('vehiclePermno') nid: string,
    @Args('recyclingPartner') station: string,
  ): Promise<DeRegisterVehicle> {
    return this.samgongustofaService.deRegisterVehicle(nid, station)
  }
}
