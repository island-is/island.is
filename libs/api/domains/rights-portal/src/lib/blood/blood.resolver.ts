import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import type { Locale } from '@island.is/shared/types'
import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { BloodService } from './blood.service'
import { BloodType } from './models/bloodType.model'

@Resolver(() => BloodType)
@UseGuards(IdsUserGuard, ScopesGuard)
@Audit({ namespace: '@island.is/api/rights-portal/blood' })
export class BloodResolver {
  constructor(private readonly service: BloodService) {}

  @Scopes(ApiScope.internal, ApiScope.health)
  @Query(() => BloodType, {
    name: 'rightsPortalBloodType',
    nullable: true,
  })
  @Audit()
  async getRightsPortalBloodType(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
  ) {
    return this.service.getBloodType(user, locale)
  }
}
