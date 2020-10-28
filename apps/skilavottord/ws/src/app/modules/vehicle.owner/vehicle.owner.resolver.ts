import { Inject } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { VehicleOwnerModel } from './model/vehicle.owner.model'
import { VehicleOwnerService } from './vehicle.owner.service'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

@Resolver(() => VehicleOwnerModel)
export class VehicleOwnerResolver {
  constructor(
    @Inject(VehicleOwnerService)
    private vehicleOwnerService: VehicleOwnerService,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  @Query(() => [VehicleOwnerModel])
  async getAllVehicleOwners(): Promise<VehicleOwnerModel[]> {
    const res = await this.vehicleOwnerService.findAll()
    this.logger.debug(
      'getAllVehicleOwners responce:' + JSON.stringify(res, null, 2),
    )
    return res
  }

  @Query(() => VehicleOwnerModel)
  async getVehiclesByNationalId(
    @Args('nationalId') nationalId: string,
  ): Promise<VehicleOwnerModel> {
    const res = await this.vehicleOwnerService.findByNationalId(nationalId)
    this.logger.info(
      'getVehicleOwnersByNationaId responce:' + JSON.stringify(res, null, 2),
    )
    return res
  }
}
