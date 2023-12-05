import { Args, Query, Resolver } from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import { UseGuards } from '@nestjs/common'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { EnergyFundsApi } from '../energyFunds.service'
import { VehicleDetailsByVin } from './models'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class MainResolver {
  constructor(private readonly energyFundsApi: EnergyFundsApi) {}

  @Scopes(
    ApiScope.internal,
    ApiScope.internalProcuring,
    ApiScope.samgongustofaVehicles,
  )
  @Query(() => VehicleDetailsByVin, {
    name: 'vehicleDetailsByVin',
    nullable: true,
  })
  async getVehicleDetailsByVin(
    @Args('vin', { type: () => String }) vin: string,
    @CurrentUser() user: User,
  ) {
    return await this.energyFundsApi.getVehicleDetails(user, vin)
  }
}
