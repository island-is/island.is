import {
  Inject,
  NotFoundException,
  UseGuards,
  forwardRef,
} from '@nestjs/common'
import { Query, Resolver, Mutation, Args, Int } from '@nestjs/graphql'
import parse from 'date-fns/parse'

import { RecyclingRequestTypes } from '../recyclingRequest'
import { Authorize, CurrentUser, User, Role } from '../auth'

import { VehicleModel, VehicleConnection } from './vehicle.model'
import { VehicleService } from './vehicle.service'
import { SamgongustofaService } from '../samgongustofa'
import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'
import { CreateVehicleInput } from './dto/createVehicle.input'

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
      throw new NotFoundException(`User does not have this vehicle`)
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
    return await this.vehicleService.create(newVehicle)
  }
}
