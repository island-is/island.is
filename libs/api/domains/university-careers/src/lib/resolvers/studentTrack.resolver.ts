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
import { AUDIT_NAMESPACE } from '../constants'
import { StudentFile } from '../models/studentFile.model'
import { isDefined, maskString } from '@island.is/shared/utils'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.education)
@Resolver(() => StudentTrack)
@Audit({ namespace: AUDIT_NAMESPACE })
@CodeOwner(CodeOwners.Hugsmidjan)
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
      input.trackNumber,
      input.universityId,
      input.locale,
    )

    if (!student) {
      return null
    }

    return {
      ...student,
    }
  }

  @ResolveField('files', () => [StudentFile])
  async resolveFiles(
    @CurrentUser() user: User,
    @Parent() track: StudentTrack,
  ): Promise<Array<StudentFile>> {
    this.auditService.audit({
      auth: user,
      namespace: AUDIT_NAMESPACE,
      action: 'resolveFiles',
      resources: user.nationalId,
    })

    if (!track.transcript || !track.files) {
      this.logger.info(
        'Student file has no transcript or files. Returning empty array',
      )
      return []
    }

    const { institution } = track.transcript

    const files = await Promise.all(
      track.files.map(async (f) => {
        if (!f.url) {
          this.logger.warn(`Student file has no URL, skipping`)
          return null
        }

        const url = await maskString(f.url, user.nationalId)
        return {
          ...f,
          downloadServiceURL: `${this.downloadServiceConfig.baseUrl}/download/v1/education/graduation/${institution.shortId}/${url}`,
        }
      }),
    )

    return files.filter(isDefined)
  }
}
