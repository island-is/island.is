import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { Inject, UseGuards } from '@nestjs/common'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'

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
import {
  StudentModel,
  StudentTrackModel,
  UniversityOfIcelandStudentInfoModel,
} from './models/universityOfIcelandStudentInfo.model'
import { UniversityOfIcelandStudentInfoQueryInput } from './dto/universityOfIcelandStudentInfo.input'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Resolver(() => UniversityOfIcelandStudentInfoModel)
export class UniversityOfIcelandResolver {
  constructor(
    private universityOfIcelandApi: UniversityOfIcelandService,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadServiceConfig: ConfigType<
      typeof DownloadServiceConfig
    >,
  ) {}

  @Query(() => UniversityOfIcelandStudentInfoModel, {
    name: 'universityOfIcelandStudentInfo',
  })
  async getUniversityOfIcelandStudentInfoModel(
    @CurrentUser() user: User,
    @Args('input') input: UniversityOfIcelandStudentInfoQueryInput,
  ): Promise<UniversityOfIcelandStudentInfoModel> {
    const data = await this.universityOfIcelandApi.studentInfo(
      user,
      input.locale as NemandiGetLocaleEnum,
    )
    return {
      transcripts: data.transcripts as Array<StudentModel>,
    }
  }

  @ResolveField('track', () => StudentTrackModel)
  async getStudentTrackModel(
    @Args('input') input: UniversityOfIcelandStudentInfoQueryInput,
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

    let date = data.transcript.graduationDate
    date = format(new Date(date), 'dd.MM.yy', { locale: is })
    const transcriptData = { ...data.transcript, graduationDate: date }
    return {
      transcript: transcriptData,
      files: data.files,
      body: data.body,
      downloadServiceURL: `${this.downloadServiceConfig.baseUrl}/download/v1/education/graduation/`,
    }
  }
}
