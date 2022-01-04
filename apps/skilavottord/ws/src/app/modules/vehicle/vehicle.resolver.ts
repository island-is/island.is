import { Inject, NotFoundException, forwardRef } from '@nestjs/common'
import { Query, Resolver, Mutation, Args } from '@nestjs/graphql'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { Authorize, CurrentUser, User, Role } from '../auth'

import { VehicleModel } from './vehicle.model'
import { VehicleService } from './vehicle.service'
import { SamgongustofaService } from '../samgongustofa/samgongustofa.service'

@Authorize()
@Resolver(() => VehicleModel)
export class VehicleResolver {
  constructor(
    private vehicleService: VehicleService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @Inject(forwardRef(() => SamgongustofaService))
    private samgongustofaService: SamgongustofaService,
  ) {}

  @Authorize({ roles: [Role.developer, Role.recyclingCompany] })
  @Query(() => [VehicleModel])
  async skilavottordAllVehicles(): Promise<VehicleModel[]> {
    const vehicles = await this.vehicleService.findAll()
    this.logger.info(
      'getAllVehicle response:' + JSON.stringify(vehicles, null, 2),
    )
    return vehicles
  }

  @Authorize({ roles: [Role.developer, Role.recyclingFund] })
  @Query(() => [VehicleModel])
  async skilavottordAllDeregisteredVehicles(): Promise<VehicleModel[]> {
    const deregisteredVehicles = await this.vehicleService.findAllDeregistered()
    this.logger.info(
      'getAllVehicle response:' + JSON.stringify(deregisteredVehicles, null, 2),
    )
    return deregisteredVehicles
  }

  @Query(() => VehicleModel)
  async skilavottordVehicleById(
    @Args('permno') permno: string,
  ): Promise<VehicleModel> {
    const vehicle = await this.vehicleService.findByVehicleId(permno)
    this.logger.info(
      'skilavottordVehicleById response:' + JSON.stringify(vehicle, null, 2),
    )
    return vehicle
  }

  @Mutation(() => Boolean)
  async createSkilavottordVehicle(
    @CurrentUser() user: User,
    @Args('permno') permno: string,
    @Args('type') type: string,
    @Args('color') color: string,
    @Args('newRegDate') newReg: Date,
    @Args('vinNumber') vin: string,
  ) {
    const vehicle = await this.samgongustofaService.getUserVehicle(
      user.nationalId,
      permno,
    )
    if (!(vehicle || Role.developer === user.role)) {
      this.logger.error(
        `User does not have right to call createSkilavottordVehicle action`,
      )
      throw new NotFoundException()
    }

    const newVehicle = new VehicleModel()
    newVehicle.vinNumber = vin
    newVehicle.newregDate = newReg
    newVehicle.vehicleColor = color
    newVehicle.vehicleType = type
    newVehicle.ownerNationalId = user.nationalId
    newVehicle.vehicleId = permno
    return await this.vehicleService.create(newVehicle)
  }
}
