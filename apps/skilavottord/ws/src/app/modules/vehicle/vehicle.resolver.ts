import { Inject } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { VehicleService } from './vehicle.service'
import { VehicleModel } from '../models'

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
