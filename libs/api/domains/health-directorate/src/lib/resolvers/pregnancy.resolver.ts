import { Query, Resolver } from '@nestjs/graphql'

import { UseGuards } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { CodeOwner } from '@island.is/nest/core'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { CodeOwners } from '@island.is/shared/constants'

import { HealthDirectorateService } from '.././health-directorate.service'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Audit({ namespace: '@island.is/api/health-directorate' })
@CodeOwner(CodeOwners.Hugsmidjan)
@Resolver()
export class PregnancyResolver {
  constructor(private api: HealthDirectorateService) {}

  @Query(() => Boolean, {
    name: 'healthDirectorateHasActivePregnancy',
    nullable: true,
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthPregnancyPageEnabled)
  hasActivePregnancy(@CurrentUser() user: User): Promise<boolean | null> {
    return this.api.hasActivePregnancy(user)
  }
}
