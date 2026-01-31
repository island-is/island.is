import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'
import { Audit, AuditService } from '@island.is/nest/audit'
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
import { AUDIT_NAMESPACE } from '../constants'
import { StudentFile } from '../models/studentFile.model'
import { mapEnumToType } from '../mapper'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.education)
@Resolver(() => StudentTrack)
@Audit({ namespace: AUDIT_NAMESPACE })
export class StudentTrackResolver {
  constructor(
    private service: UniversityCareersService,
    private readonly auditService: AuditService,
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
    }
  }

  @ResolveField('files', () => [StudentFile])
  resolveFiles(
    @CurrentUser() user: User,
    @Parent() track: StudentTrack,
  ): Array<StudentFile> {
    this.auditService.audit({
      auth: user,
      namespace: AUDIT_NAMESPACE,
      action: 'resolveFiles',
      resources: user.nationalId,
    })

    const { institution, trackNumber } = track.transcript

    return track.files.map((f) => ({
      ...f,
      downloadServiceURL: `${
        this.downloadServiceConfig.baseUrl
      }/download/v1/education/graduation/${f.locale}/${
        institution.shortId
      }/${trackNumber}/${mapEnumToType(f.type)}`,
    }))
  }
}
