import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import { VehiclesService } from './api-domains-vehicles.service'
import { UsersVehicles } from '../models/usersVehicles.model'
import { Audit } from '@island.is/nest/audit'

import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { GetVehicleDetailInput } from '../dto/getVehicleDetailInput'
import { VehicleDetail } from '../models/getVehicleDetail.model'
@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class VehiclesResolver {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Query(() => UsersVehicles, { name: 'vehiclesUserVehicles' })
  @Audit()
  async getVehicleForUser(@CurrentUser() user: User) {
    const res = await this.vehiclesService.getVehiclesForUser(user.nationalId)

    return res?.data ?? null
  }

  @Query(() => VehicleDetail, { name: 'vehiclesUserVehicleDetail' })
  @Audit()
  async getVehicleDetail(
    @Args('input') input: GetVehicleDetailInput,
    @CurrentUser() user: User,
  ) {
    const res = await this.vehiclesService.getVehicleDetail({
      clientPersidno: user.nationalId,
      permno: input.permno,
      regno: input.regno,
      vin: input.vin,
    })
    return res ?? null
  }
}
