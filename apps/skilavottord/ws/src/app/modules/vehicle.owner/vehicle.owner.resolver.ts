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
    return await this.vehicleOwnerService.findAll()
  }

  // @Query(() => Gdpr)
  // async getVehiclesForNationalId(
  //   @Args('nationalId') nid: string,
  // ): Promise<Gdpr> {
  //   return await this.gdprService.findByNationalId(nid)
  // }
}
