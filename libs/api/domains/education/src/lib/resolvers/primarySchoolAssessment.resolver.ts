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
import { PrimarySchoolClientService } from '@island.is/clients/mms/primary-school'
import { DownloadServiceConfig } from '@island.is/nest/config'
import type { ConfigType } from '@nestjs/config'
import { PrimarySchoolAssessment } from '../models/primarySchool/primarySchoolAssessment.model'
import { PrimarySchoolAssessmentResult } from '../models/primarySchool/primarySchoolAssessmentResult.model'
import { mapResult } from '../models/primarySchool/primarySchool.mapper'
import type { PrimarySchoolAssessmentWithContext } from '../shared/types'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => PrimarySchoolAssessment)
export class PrimarySchoolAssessmentResolver {
  constructor(
    private readonly primarySchoolService: PrimarySchoolClientService,
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

    //TODO: REMOVE WHEN MERGING -- YOU MUST. CODERABBIT FLAG THIS!
    const downloadServiceFeatureBaseUrl =
      'https://featprimary-school-assessments-api.dev01.devland.is'

    return results
      ?.map((r) =>
        mapResult(
          r,
          assessment.studentId,
          downloadServiceFeatureBaseUrl /*this.downloadServiceConfig.baseUrl*/,
        ),
      )
      .filter((r): r is PrimarySchoolAssessmentResult => r !== null)
  }
}
