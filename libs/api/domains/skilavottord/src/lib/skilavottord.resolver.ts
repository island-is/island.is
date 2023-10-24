import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { ApiScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsAuthGuard,
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'

// import { SkilavottordService } from './skilavottord.service'
import { Vehicle } from '../models/vehicle.model'

@UseGuards(IdsAuthGuard, IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Resolver()
export class SkilavottordResolver {
  // constructor(private skilavottordService: SkilavottordService) {}

  // @Query(() => [Vehicle], { nullable: true })
  @Query()
  async getVehicles(
    @CurrentUser() user: User,
  ): Promise<void> {
  // ): Promise<Vehicle[] | null> {
    // return this.skilavottordService.getVehicles(user.nationalId)
    console.log('hello..........')
  }
}
