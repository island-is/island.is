import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { VehiclesService } from '../services/vehicles.service'
import { VehiclesCurrentListResponse } from '../models/v3/currentVehicleListResponse.model'
import { VehiclesListInputV3 } from '../dto/vehiclesListInputV3'
import { MileageRegistrationHistory } from '../models/v3/mileageRegistrationHistory.model'
import { GetVehicleMileageInput } from '../dto/getVehicleMileageInput'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => VehiclesCurrentListResponse)
@Audit({ namespace: '@island.is/api/vehicles' })
export class VehiclesV3Resolver {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Scopes(ApiScope.vehicles)
  @Query(() => VehiclesCurrentListResponse, {
    name: 'vehiclesListV3',
    nullable: true,
  })
  @Audit()
  async getVehicleListV3(
    @CurrentUser() user: User,
    @Args('input', { nullable: true }) input: VehiclesListInputV3,
  ) {
    return this.vehiclesService.getVehiclesListV3(user, input)
  }

  @Scopes(ApiScope.vehicles)
  @Query(() => MileageRegistrationHistory, {
    name: 'vehiclesMileageRegistrationHistory',
    nullable: true,
  })
  @Audit()
  async vehicleMileageRegistrations(
    @CurrentUser() user: User,
    @Args('input', { nullable: true }) input: GetVehicleMileageInput,
  ) {
    return this.vehiclesService.getVehicleMileageHistory(user, input)
  }
}
