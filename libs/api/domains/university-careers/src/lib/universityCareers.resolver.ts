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
import { StudentInfoByUniversityInput } from './dto/studentInfoByUniversity.input'
import { UniversityId } from '@island.is/clients/university-careers'
import { Locale } from '@island.is/shared/types'
import { mapToStudentTrackModel } from './mapper'
import { StudentTrack } from './models/studentTrack.model'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { StudentInfoInput } from './dto/studentInfo.input'
import { UniversityCareersService } from './universityCareers.service'
import { StudentTrackHistory } from './models/studentTrackHistory.model'
import { StudentTrackTranscript } from './models/studentTrackTranscript.model'

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
  async studentTrackHistory(): Promise<StudentTrackHistory | null> {
    return {}
  }

  @ResolveField('universityOfIceland', () => [StudentTrackTranscript])
  @Audit()
  async resolveUniversityOfIceland(
    @CurrentUser() user: User,
    @Args('input') input: StudentInfoInput,
  ) {
    return this.service.getStudentTrackHistoryByUniversity(
      user,
      UniversityId.UniversityOfIceland,
      input.locale as Locale,
    )
  }

  @ResolveField('universityOfAkureyri', () => [StudentTrackTranscript])
  @Audit()
  async resolveUNAK(
    @CurrentUser() user: User,
    @Args('input') input: StudentInfoInput,
  ) {
    return this.service.getStudentTrackHistoryByUniversity(
      user,
      UniversityId.UniversityOfAkureyri,
      input.locale as Locale,
    )
  }

  @ResolveField('bifrostUniversity', () => [StudentTrackTranscript])
  @Audit()
  async resvoleBifrostUniversity(
    @CurrentUser() user: User,
    @Args('input') input: StudentInfoInput,
  ) {
    return this.service.getStudentTrackHistoryByUniversity(
      user,
      UniversityId.BifrostUniversity,
      input.locale as Locale,
    )
  }

  @ResolveField('holarUniversity', () => [StudentTrackTranscript])
  @Audit()
  async resolveHolar(
    @CurrentUser() user: User,
    @Args('input') input: StudentInfoInput,
  ) {
    return this.service.getStudentTrackHistoryByUniversity(
      user,
      UniversityId.HolarUniversity,
      input.locale as Locale,
    )
  }

  @ResolveField('agriculturalUniversityOfIceland', () => [
    StudentTrackTranscript,
  ])
  @Audit()
  async resolveAgriculturalUniversityOfIceland(
    @CurrentUser() user: User,
    @Args('input') input: StudentInfoInput,
  ) {
    return this.service.getStudentTrackHistoryByUniversity(
      user,
      UniversityId.AgriculturalUniversityOfIceland,
      input.locale as Locale,
    )
  }

  @Query(() => StudentTrack, {
    name: 'universityCareersStudentTrack',
  })
  @Audit()
  async studentTrack(
    @Args('input') input: StudentInfoByUniversityInput,
    @CurrentUser() user: User,
  ): Promise<StudentTrack | null> {
    if (!input.trackNumber) {
      return null
    }
    const data = await this.service.getStudentTrack(
      user,
      input.universityId ?? UniversityId.UniversityOfIceland,
      input.trackNumber,
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
