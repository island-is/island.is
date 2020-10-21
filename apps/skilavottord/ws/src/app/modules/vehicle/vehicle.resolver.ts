import { Inject } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { VehicleModel } from './model/vehicle.model'
import { VehicleService } from './vehicle.service'

@Resolver(() => VehicleModel)
export class VehicleResolver {
  constructor(@Inject(VehicleService) private vehicleService: VehicleService) {}

  @Query(() => [VehicleModel])
  async getAllVehicles(): Promise<VehicleModel[]> {
    return await this.vehicleService.findAll()
  }

  // @Query(() => Gdpr)
  // async getVehiclesForNationalId(
  //   @Args('nationalId') nid: string,
  // ): Promise<Gdpr> {
  //   return await this.gdprService.findByNationalId(nid)
  // }
}
