import { Inject } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { VehicleOwnerService } from './vehicle.owner.service'
import { VehicleOwnerModel } from '../models'

@Resolver(() => VehicleOwnerModel)
export class VehicleOwnerResolver {
  constructor(
    @Inject(VehicleOwnerService)
    private vehicleOwnerService: VehicleOwnerService,
  ) {}

  @Query(() => [VehicleOwnerModel])
  async getAllVehicleOwners(): Promise<VehicleOwnerModel[]> {
    const res = await this.vehicleOwnerService.findAll()
    console.log('res->' + JSON.stringify(res, null, 2))
    return await this.vehicleOwnerService.findAll()
  }
}
