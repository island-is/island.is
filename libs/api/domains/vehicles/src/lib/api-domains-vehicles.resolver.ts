import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import { VehiclesService } from './api-domains-vehicles.service'
import { VehiclesList } from '../models/usersVehicles.model'
import { Audit } from '@island.is/nest/audit'

import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { GetVehicleDetailInput } from '../dto/getVehicleDetailInput'
import { VehiclesDetail } from '../models/getVehicleDetail.model'
@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class VehiclesResolver {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Query(() => VehiclesList, { name: 'vehiclesList' })
  @Audit()
  async getVehicleList(@CurrentUser() user: User) {
    const res = await this.vehiclesService.getVehiclesForUser(user.nationalId)

    return res?.data ?? null
  }

  @Query(() => VehiclesDetail, { name: 'vehiclesDetail' })
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
