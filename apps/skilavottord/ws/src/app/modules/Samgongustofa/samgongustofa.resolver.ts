import { Query, Resolver, Args } from '@nestjs/graphql'
import { VehicleInformation, DeRegisterVehicle } from './models'
import { SamgongustofaService } from './models/samgongustofa.service'

@Resolver(() => VehicleInformation)
export class SamgongustofaResolver {
  SamgongustofaService: SamgongustofaService

  constructor() {
    this.SamgongustofaService = new SamgongustofaService()
  }

  @Query(() => [VehicleInformation])
  async getVehicleInformation(
    @Args('nationalId') nid: string,
  ): Promise<Array<VehicleInformation>> {
    //async getVehicleInformation(@Args('nationalId') nid: string): Promise<VehicleInformation> {
    // return this.VehicleInformationService.getVehicleInformation(nid);
    return await this.SamgongustofaService.getVehicleInformation(nid)
  }

  @Query(() => DeRegisterVehicle)
  async deRegisterVehicle(
    @Args('vehiclePermno') nid: string,
  ): Promise<DeRegisterVehicle> {
    return await this.SamgongustofaService.deRegisterVehicle(nid)
  }
}
