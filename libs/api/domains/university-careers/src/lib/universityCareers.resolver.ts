import { Args, Query, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'
import { Audit } from '@island.is/nest/audit'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { DownloadServiceConfig } from '@island.is/nest/config'
import type { ConfigType } from '@island.is/nest/config'
import { StudentInfoByUniversityInput } from './dto/studentInfoByUniversity.input'
import { UniversityId } from '@island.is/clients/university-careers'
import { Locale } from '@island.is/shared/types'
import { StudentTrack } from './models/studentTrack.model'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { StudentInfoInput } from './dto/studentInfo.input'
import { UniversityCareersService } from './universityCareers.service'
import { StudentTrackHistory } from './models/studentTrackHistory.model'
import { StudentTrackTranscriptResult } from './models/studentTrackTranscriptResult.model'
import { isDefined } from '@island.is/shared/utils'
import { OrganizationSlugType } from '@island.is/shared/constants'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Resolver(() => StudentTrackHistory)
@Audit({ namespace: '@island.is/api/university-careers' })
export class UniversityCareersResolver {
  constructor(
    private service: UniversityCareersService,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadServiceConfig: ConfigType<
      typeof DownloadServiceConfig
    >,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Query(() => StudentTrackHistory, {
    name: 'universityCareersStudentTrackHistory',
  })
  @Audit()
  async studentTrackHistory(
    @CurrentUser() user: User,
    @Args('input') input: StudentInfoInput,
  ): Promise<StudentTrackHistory | null> {
    const data = (
      await Promise.all(
        Object.values(UniversityId).map((u) =>
          this.service.getStudentTrackHistoryByUniversity(
            user,
            u,
            input.locale as Locale,
          ),
        ),
      )
    ).filter(isDefined)

    let normalizedResults: Array<typeof StudentTrackTranscriptResult> = []
    data.forEach((result) =>
      Array.isArray(result)
        ? (normalizedResults = normalizedResults.concat(result))
        : normalizedResults.push(result),
    )

    return {
      trackResults: normalizedResults,
    }
  }

  @Query(() => StudentTrack, {
    name: 'universityCareersStudentTrack',
    nullable: true,
  })
  @Audit()
  async studentTrack(
    @Args('input') input: StudentInfoByUniversityInput,
    @CurrentUser() user: User,
  ): Promise<StudentTrack | null> {
    if (!input.trackNumber) {
      return null
    }

    const student = await this.service.getStudentTrack(
      user,
      input.universityId as OrganizationSlugType,
      input.trackNumber,
      input.locale as Locale,
    )

    if (!student) {
      return null
    }

    return {
      ...student,
      downloadServiceURL: `${this.downloadServiceConfig.baseUrl}/download/v1/education/graduation/`,
    }
  }
}
