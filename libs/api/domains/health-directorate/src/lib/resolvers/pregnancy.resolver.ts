import { Args, ID, Query, Resolver } from '@nestjs/graphql'

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

import { HealthDirectorateService } from '../health-directorate.service'
import { ActivePregnancy } from '../models/activePregnancy.model'
import { Communication } from '../models/communication.model'
import { HealthDirectorateCommunicationDetail } from '../models/communicationDetail.model'
import { ExaminationMeasurement } from '../models/examinationMeasurement.model'
import { PregnancyDocument } from '../models/pregnancyDocument.model'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Audit({ namespace: '@island.is/api/health-directorate' })
@CodeOwner(CodeOwners.Hugsmidjan)
@Resolver(() => ActivePregnancy)
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

  @Query(() => ActivePregnancy, {
    name: 'healthDirectorateActivePregnancy',
    nullable: true,
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthPregnancyPageEnabled)
  activePregnancy(
    @CurrentUser() user: User,
  ): Promise<ActivePregnancy | null> {
    return this.api.getActivePregnancy(user)
  }

  @Query(() => [Communication], {
    name: 'healthDirectoratePregnancyCommunications',
    nullable: true,
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthPregnancyPageEnabled)
  pregnancyCommunications(
    @Args('pregnancyId', { type: () => ID }) pregnancyId: string,
    @CurrentUser() user: User,
  ): Promise<Communication[] | null> {
    return this.api.getPregnancyCommunications(user, pregnancyId)
  }

  @Query(() => HealthDirectorateCommunicationDetail, {
    name: 'healthDirectoratePregnancyCommunicationDetail',
    nullable: true,
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthPregnancyPageEnabled)
  pregnancyCommunicationDetail(
    @Args('pregnancyId', { type: () => ID }) pregnancyId: string,
    @Args('communicationId', { type: () => ID }) communicationId: string,
    @CurrentUser() user: User,
  ): Promise<typeof HealthDirectorateCommunicationDetail | null> {
    return this.api.getPregnancyCommunicationDetail(
      user,
      pregnancyId,
      communicationId,
    )
  }

  @Query(() => [ExaminationMeasurement], {
    name: 'healthDirectoratePregnancyMeasurements',
    nullable: true,
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthPregnancyPageEnabled)
  pregnancyMeasurements(
    @Args('pregnancyId', { type: () => ID }) pregnancyId: string,
    @CurrentUser() user: User,
  ): Promise<ExaminationMeasurement[] | null> {
    return this.api.getPregnancyMeasurements(user, pregnancyId)
  }

  @Query(() => [PregnancyDocument], {
    name: 'healthDirectoratePregnancyDocuments',
    nullable: true,
  })
  @Audit()
  @Scopes(ApiScope.internal, ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthPregnancyPageEnabled)
  pregnancyDocuments(
    @Args('pregnancyId', { type: () => ID }) pregnancyId: string,
    @CurrentUser() user: User,
  ): Promise<PregnancyDocument[] | null> {
    return this.api.getPregnancyDocuments(user, pregnancyId)
  }
}
