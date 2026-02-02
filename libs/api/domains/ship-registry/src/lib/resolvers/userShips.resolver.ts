import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { ApiScope } from '@island.is/auth/scopes'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { UserShip } from '../models/userShip.model'
import { UserShipsCollection } from '../models/userShipsCollection.model'
import { UserShipsService } from '../services/userShips.service'
import { UserShipInput } from '../dto/userShip.input'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Scopes(ApiScope.internal)
@FeatureFlag(Features.isServicePortalUserShipsPageEnabled)
@Audit({ namespace: '@island.is/api/ship-registry' })
@Resolver(() => UserShip)
export class UserShipsResolver {
  constructor(private readonly userShipsService: UserShipsService) {}

  @Query(() => UserShipsCollection, {
    name: 'shipRegistryUserShips',
    nullable: true,
  })
  async userShips(@CurrentUser() user: User): Promise<UserShipsCollection> {
    return this.userShipsService.getUserShips(user)
  }

  @Query(() => UserShip, {
    name: 'shipRegistryUserShip',
    nullable: true,
  })
  async userShip(
    @Args('input') input: UserShipInput,
    @CurrentUser() user: User,
  ): Promise<UserShip | null> {
    return this.userShipsService.getUserShip(user, input.id)
  }
}
