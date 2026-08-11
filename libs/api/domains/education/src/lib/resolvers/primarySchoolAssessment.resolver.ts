import { ApiScope } from '@island.is/auth/scopes'
import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import {
  FeatureFlag,
  FeatureFlagGuard,
  FeatureFlagService,
  Features,
} from '@island.is/nest/feature-flags'
import { PrimarySchoolClientService } from '@island.is/clients/mms/primary-school'
import { isDefined } from '@island.is/shared/utils'
import { DownloadServiceConfig } from '@island.is/nest/config'
import type { ConfigType } from '@nestjs/config'
import { PrimarySchoolAssessment } from '../models/primarySchool/primarySchoolAssessment.model'
import { PrimarySchoolAssessmentResult } from '../models/primarySchool/primarySchoolAssessmentResult.model'
import {
  mapResult,
  PrimarySchoolPdfImplementation,
} from '../models/primarySchool/primarySchool.mapper'
import type { PrimarySchoolAssessmentWithContext } from '../types'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.isServicePortalPrimarySchoolPageEnabled)
@Resolver(() => PrimarySchoolAssessment)
export class PrimarySchoolAssessmentResolver {
  constructor(
    private readonly primarySchoolService: PrimarySchoolClientService,
    private readonly featureFlagService: FeatureFlagService,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadServiceConfig: ConfigType<
      typeof DownloadServiceConfig
    >,
  ) {}

  @ResolveField(() => [PrimarySchoolAssessmentResult], { nullable: true })
  @Scopes(ApiScope.education)
  async resultHistory(
    @CurrentUser() user: User,
    @Parent() assessment: PrimarySchoolAssessmentWithContext,
  ) {
    const results = await this.primarySchoolService.getAssignmentResultsSimple(
      user,
      assessment.studentId,
      assessment.id,
    )

    const requestedImplementation = await this.featureFlagService.getValue(
      Features.downloadServiceMmsPrimarySchoolImplementationTest,
      'current',
      user,
    )
    const implementation: PrimarySchoolPdfImplementation =
      requestedImplementation === 'new' ? 'new' : 'current'

    return results
      ?.map((r) =>
        mapResult(
          r,
          assessment.studentId,
          this.downloadServiceConfig.baseUrl,
          implementation,
        ),
      )
      .filter(isDefined)
  }
}
