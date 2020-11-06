import { Inject } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { VehicleModel } from './model/vehicle.model'
import { VehicleService } from './vehicle.service'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

@Resolver(() => VehicleModel)
export class VehicleResolver {
  constructor(
    @Inject(VehicleService) private vehicleService: VehicleService,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  @Query(() => [VehicleModel])
  async skilavottordAllVehicles(): Promise<VehicleModel[]> {
    const res = await this.vehicleService.findAll()
    this.logger.info('getAllVehicle response:' + JSON.stringify(res, null, 2))
    return res
  }

  @Query(() => [VehicleModel])
  async skilavottordAllDeregisteredVehicles(): Promise<VehicleModel[]> {
    const res = await this.vehicleService.findAllDeregistered()
    this.logger.info('getAllVehicle response:' + JSON.stringify(res, null, 2))
    return res
  }

  // @Query(() => Gdpr)
  // async getVehiclesForNationalId(
  //   @Args('nationalId') nid: string,
  // ): Promise<Gdpr> {
  //   return await this.gdprService.findByNationalId(nid)
  // }
}
