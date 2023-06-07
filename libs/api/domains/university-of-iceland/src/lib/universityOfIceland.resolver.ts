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
import {
  UniversityOfIcelandService,
  NemandiGetLocaleEnum,
  NemandiFerillFerillGetLocaleEnum,
} from '@island.is/clients/university-of-iceland'
import { ApiScope } from '@island.is/auth/scopes'
import { DownloadServiceConfig } from '@island.is/nest/config'
import type { ConfigType } from '@island.is/nest/config'
import { StudentInfoInput } from './dto/studentInfo.input'
import {
  StudentInfo,
  Student,
  StudentTrackModel,
} from './models/studentInfo.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Resolver(() => StudentInfo)
@Audit({ namespace: '@island.is/api/university-of-iceland' })
export class UniversityOfIcelandResolver {
  constructor(
    private universityOfIcelandApi: UniversityOfIcelandService,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadServiceConfig: ConfigType<
      typeof DownloadServiceConfig
    >,
  ) {}

  @Query(() => StudentInfo, { name: 'universityOfIcelandStudentInfo' })
  @Audit()
  async studentInfo(
    @CurrentUser() user: User,
    @Args('input') input: StudentInfoInput,
  ): Promise<StudentInfo | null> {
    const data = await this.universityOfIcelandApi.studentInfo(
      user,
      input.locale as NemandiGetLocaleEnum,
    )
    return {
      transcripts: data?.transcripts as Array<Student>,
    }
  }

  @ResolveField('track', () => StudentTrackModel)
  @Audit()
  async resolveTrack(
    @Args('input') input: StudentInfoInput,
    @CurrentUser() user: User,
  ): Promise<StudentTrackModel | null> {
    if (!input.trackNumber) {
      return null
    }
    const data = (await this.universityOfIcelandApi.studentCareer(
      user,
      input.trackNumber,
      input.locale as NemandiFerillFerillGetLocaleEnum,
    )) as StudentTrackModel

    const transcriptData = {
      ...data.transcript,
      graduationDate: data.transcript.graduationDate,
    }
    return {
      transcript: transcriptData,
      files: data.files,
      body: data.body,
      downloadServiceURL: `${this.downloadServiceConfig.baseUrl}/download/v1/education/graduation/`,
    }
  }
}
