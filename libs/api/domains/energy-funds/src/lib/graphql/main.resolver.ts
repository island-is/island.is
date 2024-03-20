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
import { EnergyFundsService } from '../energyFunds.service'
import { VehicleGrant } from './models'
import { VehicleDetailsWithGrant } from './models/getVehicleWithGrant.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class MainResolver {
  constructor(private readonly energyFundsService: EnergyFundsService) {}

  @Scopes(ApiScope.energyFunds)
  @Query(() => VehicleGrant, {
    name: 'energyFundVehicleGrant',
    nullable: true,
  })
  async getVehicleGrantByVin(
    @Args('vin', { type: () => String }) vin: string,
    @CurrentUser() user: User,
  ) {
    return this.energyFundsService.getVehicleDetails(user, vin)
  }

  @Scopes(ApiScope.energyFunds)
  @Query(() => VehicleDetailsWithGrant, {
    name: 'energyFundVehicleDetailsWithGrant',
    nullable: true,
  })
  async getVehicleDetailsWithGrantByPermno(
    @Args('permno', { type: () => String }) permno: string,
    @CurrentUser() user: User,
  ) {
    return this.energyFundsService.getVehicleDetailsWithGrant(user, permno)
  }
}
