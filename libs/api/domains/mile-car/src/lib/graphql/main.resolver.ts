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
import { TransportAuthorityApi } from '../mileCar.service'
import { BasicVehicleInformation } from './models'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class MainResolver {
  constructor(private readonly transportAuthorityApi: TransportAuthorityApi) {}

  @Scopes(ApiScope.samgongustofaVehicles)
  @Query(() => BasicVehicleInformation, {
    name: 'vehicleBasicInfoByPermno',
    nullable: true,
  })
  async getBasicVehicleInfoByPermno(
    @Args('permno', { type: () => String }) permno: string,
    @CurrentUser() user: User,
  ) {
    return await this.transportAuthorityApi.getBasicVehicleInfoByPermno(
      user,
      permno,
    )
  }
}
