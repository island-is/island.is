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
import { StudentTrack } from '../models/studentTrack.model'
import { UniversityCareersService } from '../universityCareers.service'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { StudentInfoByUniversityInput } from '../dto/studentInfoByUniversity.input'
import { Locale } from '@island.is/shared/types'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.education)
@Resolver(() => StudentTrack)
@Audit({ namespace: '@island.is/api/university-careers' })
export class StudentTrackResolver {
  constructor(
    private service: UniversityCareersService,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadServiceConfig: ConfigType<
      typeof DownloadServiceConfig
    >,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

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
