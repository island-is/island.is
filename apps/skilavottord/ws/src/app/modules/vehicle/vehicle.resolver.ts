import { Inject } from '@nestjs/common'
import { Query, Resolver, Mutation, Args } from '@nestjs/graphql'
import { VehicleModel } from './model/vehicle.model'
import { VehicleService } from './vehicle.service'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Authorize, AuthService, CurrentUser, AuthUser } from '../auth'

@Resolver(() => VehicleModel)
export class VehicleResolver {
  constructor(
    @Inject(VehicleService) private vehicleService: VehicleService,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  @Authorize({ throwOnUnAuthorized: false })
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

  @Query(() => VehicleModel)
  async skilavottordVehicleById(
    @Args('permno') permno: string,
  ): Promise<VehicleModel> {
    const res = await this.vehicleService.findByVehicleId(permno)
    this.logger.info(
      'skilavottordVehicleById response:' + JSON.stringify(res, null, 2),
    )
    return res
  }

  @Mutation(() => Boolean)
  async createSkilavottordVehicle(
    @Args('permno') permno: string,
    @Args('nationalId') nid: string,
    @Args('type') type: string,
    @Args('color') color: string,
    @Args('newRegDate') newReg: Date,
    @Args('vinNumber') vin: string,
  ) {
    const newVehicle = new VehicleModel()
    newVehicle.vinNumber = vin
    newVehicle.newregDate = newReg
    newVehicle.vehicleColor = color
    newVehicle.vehicleType = type
    newVehicle.ownerNationalId = nid
    newVehicle.vehicleId = permno
    return await this.vehicleService.create(newVehicle)
  }
}
