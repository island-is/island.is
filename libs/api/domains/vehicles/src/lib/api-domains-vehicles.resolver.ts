import { Args, Query, Resolver } from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import { UseGuards } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import { VehiclesService } from './api-domains-vehicles.service'
import { VehiclesList } from '../models/usersVehicles.model'
import { Audit } from '@island.is/nest/audit'

import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { GetVehicleDetailInput } from '../dto/getVehicleDetailInput'
import { VehiclesDetail } from '../models/getVehicleDetail.model'
@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.vehicles)
@Resolver()
@Audit({ namespace: '@island.is/api/vehicles' })
export class VehiclesResolver {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Query(() => VehiclesList, { name: 'vehiclesList', nullable: true })
  @Audit()
  async getVehicleList(@CurrentUser() user: User) {
    return await this.vehiclesService.getVehiclesForUser(user.nationalId)
  }

  @Query(() => VehiclesDetail, { name: 'vehiclesDetail', nullable: true })
  @Audit()
  async getVehicleDetail(
    @Args('input') input: GetVehicleDetailInput,
    @CurrentUser() user: User,
  ) {
    return await this.vehiclesService.getVehicleDetail({
      clientPersidno: user.nationalId,
      permno: input.permno,
      regno: input.regno,
      vin: input.vin,
    })
  }
}
