import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'

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

import { HealthDirectorateService } from '../health-directorate.service'
import { HealthDirectorateTreatment } from '../models/treatment.model'

@CodeOwner(CodeOwners.Hugsmidjan)
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Audit({ namespace: '@island.is/api/health-directorate' })
@Resolver(() => HealthDirectorateTreatment)
export class TreatmentsResolver {
  constructor(private api: HealthDirectorateService) {}

  @Query(() => [HealthDirectorateTreatment], {
    name: 'healthDirectorateTreatments',
    nullable: true,
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthTreatmentsPageEnabled)
  getTreatments(
    @CurrentUser() user: User,
  ): Promise<HealthDirectorateTreatment[] | null> {
    return this.api.getTreatments(user)
  }
}
