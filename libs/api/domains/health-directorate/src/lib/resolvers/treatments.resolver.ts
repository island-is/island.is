import { UseGuards } from '@nestjs/common'
import { Args, ID, Query, Resolver } from '@nestjs/graphql'

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
import { HealthDirectorateTreatmentDetail } from '../models/treatmentDetail.model'
import { HealthDirectorateTreatmentDocument } from '../models/treatmentDocument.model'

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

  @Query(() => HealthDirectorateTreatmentDetail, {
    name: 'healthDirectorateTreatment',
    nullable: true,
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthTreatmentsPageEnabled)
  getTreatment(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<HealthDirectorateTreatmentDetail | null> {
    return this.api.getTreatment(user, id)
  }

  @Query(() => [HealthDirectorateTreatmentDocument], {
    name: 'healthDirectorateTreatmentDocuments',
    nullable: true,
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthTreatmentsPageEnabled)
  getTreatmentDocuments(
    @Args('treatmentId', { type: () => ID }) treatmentId: string,
    @CurrentUser() user: User,
  ): Promise<HealthDirectorateTreatmentDocument[] | null> {
    return this.api.getTreatmentDocuments(user, treatmentId)
  }
}
