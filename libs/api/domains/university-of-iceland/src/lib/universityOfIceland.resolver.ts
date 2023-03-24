import { Args, Query, Resolver } from '@nestjs/graphql'

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
  StudentTrackTranscripts,
} from '@island.is/clients/university-of-iceland'
import { ApiScope } from '@island.is/auth/scopes'
import { StudentInfoModel } from './models/studentInfo.model'
import { StudentInfoDetailModel } from './models/studentInfoDetail.model'
import { GetStudentInfoDetailInput } from './dto/getStudentInfoDetail.input'
import { GetStudentInfoInput } from './dto/getStudentInfo.input'
import { DownloadServiceConfig } from '@island.is/nest/config'
import type { ConfigType } from '@island.is/nest/config'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Resolver()
export class UniversityOfIcelandResolver {
  constructor(
    private universityOfIcelandApi: UniversityOfIcelandService,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadServiceConfig: ConfigType<
      typeof DownloadServiceConfig
    >,
  ) {}

  @Query(() => StudentInfoModel)
  async getStudentInfo(
    @CurrentUser() user: User,
    @Args('input') input: GetStudentInfoInput,
  ): Promise<StudentTrackTranscripts> {
    const data = await this.universityOfIcelandApi.studentInfo(
      user,
      input.locale as NemandiGetLocaleEnum,
    )
    return data
  }

  @Query(() => StudentInfoDetailModel)
  async getStudentInfoDetail(
    @Args('input') input: GetStudentInfoDetailInput,
    @CurrentUser() user: User,
  ): Promise<StudentInfoDetailModel> {
    const data = (await this.universityOfIcelandApi.studentCareer(
      user,
      input.trackNumber,
      input.locale as NemandiFerillFerillGetLocaleEnum,
    )) as StudentInfoDetailModel

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
