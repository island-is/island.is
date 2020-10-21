import { Inject } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
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
    this.logger.debug('getAllVehicleOwners responce:' + JSON.stringify(res, null, 2))
    return await this.vehicleOwnerService.findAll()
  }
}
