import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql'
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
import { StudentInfoInput } from './dto/studentInfo.input'
import { StudentInfo } from './models/studentInfo.model'
import {
  UniversityCareersClientService,
  UniversityId,
} from '@island.is/clients/university-careers'
import { Locale } from '@island.is/shared/types'
import { isDefined } from '@island.is/shared/utils'
import { mapToStudent, mapToStudentTrackModel } from './mapper'
import { StudentTrack } from './models/studentTrack.model'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Resolver(() => StudentInfo)
@Audit({ namespace: '@island.is/api/university-careers' })
export class UniversityCareersResolver {
  constructor(
    private universityCareers: UniversityCareersClientService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadServiceConfig: ConfigType<
      typeof DownloadServiceConfig
    >,
  ) {}

  @Query(() => StudentInfo, { name: 'universityCareersStudentInfo' })
  @Audit()
  async studentInfo(
    @CurrentUser() user: User,
    @Args('input') input: StudentInfoInput,
  ): Promise<StudentInfo | null> {
    const data = await this.universityCareers.getStudentInfo(
      user,
      input.universityId ?? UniversityId.UniversityOfIceland,
      input.locale as Locale,
    )

    const mappedData = data?.map((d) => mapToStudent(d)).filter(isDefined)

    if (!mappedData) {
      return null
    }

    return {
      transcripts: mappedData,
    }
  }

  @ResolveField('track', () => StudentTrack)
  @Audit()
  async resolveTrack(
    @Args('input') input: StudentInfoInput,
    @CurrentUser() user: User,
  ): Promise<StudentTrack | null> {
    if (!input.trackNumber) {
      return null
    }
    const data = await this.universityCareers.getStudentCareer(
      user,
      input.trackNumber,
      input.universityId ?? UniversityId.UniversityOfIceland,
      input.locale as Locale,
    )

    if (!data) {
      return null
    }

    const studentTrack = mapToStudentTrackModel(data)

    if (!studentTrack) {
      return null
    }

    return {
      ...studentTrack,
      downloadServiceURL: `${this.downloadServiceConfig.baseUrl}/download/v1/education/graduation/`,
    }
  }
}
