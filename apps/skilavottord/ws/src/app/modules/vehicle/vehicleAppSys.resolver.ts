import {
  Inject,
  NotFoundException,
  UseGuards,
  forwardRef,
} from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import parse from 'date-fns/parse'

import { CurrentUser, User } from '../auth'

import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'
import { SamgongustofaService } from '../samgongustofa'
import { CreateVehicleInput } from './dto/createVehicle.input'
import { VehicleModel } from './vehicle.model'
import { VehicleService } from './vehicle.service'
import { logger } from '@island.is/logging'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => VehicleModel)
export class VehicleAppSysResolver {
  constructor(
    private vehicleService: VehicleService,
    @Inject(forwardRef(() => SamgongustofaService))
    private samgongustofaService: SamgongustofaService,
  ) {}

  @Mutation(() => Boolean)
  async createSkilavottordVehicleAppSys(
    @CurrentUser() user: User,
    @Args('input') input: CreateVehicleInput,
  ) {
    const vehicle = await this.samgongustofaService.getUserVehicle(
      user.nationalId,
      input.permno,
    )
    if (!vehicle) {
      logger.error(
        `User ${user.nationalId} does not own the requested vehicle`,
        { permno: input.permno, user },
      )
      return null
    }
    const newVehicle = new VehicleModel()
    newVehicle.vinNumber = vehicle.vinNumber
    newVehicle.newregDate = parse(
      vehicle.firstRegDate,
      'dd.MM.yyyy',
      new Date(),
    )
    newVehicle.vehicleColor = vehicle.color
    newVehicle.vehicleType = vehicle.type
    newVehicle.ownerNationalId = user.nationalId
    newVehicle.vehicleId = vehicle.permno
    newVehicle.mileage = input.mileage
    return await this.vehicleService.create(newVehicle)
  }
}
