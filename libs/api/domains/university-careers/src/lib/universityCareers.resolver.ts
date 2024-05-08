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
import { Locale } from '@island.is/shared/types'
import { StudentTrack } from './models/studentTrack.model'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { StudentInfoInput } from './dto/studentInfo.input'
import { UniversityCareersService } from './universityCareers.service'
import { StudentTrackHistory } from './models/studentTrackHistory.model'

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
    return await this.service.getStudentTrackHistory(
      user,
      input.locale as Locale,
    )
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
      input.universityId,
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
