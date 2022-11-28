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
import { OrderVehicleLicensePlateApi } from '../orderVehicleLicensePlate.service'
import { DeliveryStation } from './models'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Resolver()
export class MainResolver {
  constructor(
    private readonly orderVehicleLicensePlateApi: OrderVehicleLicensePlateApi,
  ) {}

  @Query(() => [DeliveryStation])
  transportAuthorityInsuranceCompanies(@CurrentUser() user: User) {
    return this.orderVehicleLicensePlateApi.getDeliveryStations(user)
  }
}
