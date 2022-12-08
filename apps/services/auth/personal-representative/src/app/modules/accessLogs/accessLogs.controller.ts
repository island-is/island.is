import { AuthScope } from '@island.is/auth/scopes'
import {
  PersonalRepresentativeAccessService,
  PaginatedPersonalRepresentativeAccessDto,
  PaginationWithNationalIdsDto,
} from '@island.is/auth-api-lib'
import { Controller, UseGuards, Get, Inject, Query } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { Documentation } from '@island.is/nest/swagger'
import { IdsAuthGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { environment } from '../../../environments'
import { Audit } from '@island.is/nest/audit'

const namespace = `${environment.audit.defaultNamespace}/access-logs`

@UseGuards(IdsAuthGuard, ScopesGuard)
@Scopes(AuthScope.adminPersonalRepresentative)
@ApiTags('Access logs')
@Controller('v1/access-logs')
@ApiBearerAuth()
@Audit({ namespace })
export class AccessLogsController {
  constructor(
    @Inject(PersonalRepresentativeAccessService)
    private readonly personalRepresentativeAccessService: PersonalRepresentativeAccessService,
  ) {}

  /** Gets all access logs  */
  @Get()
  @Documentation({
    summary: 'Get a list of all logged accesses',
    response: {
      status: 200,
      type: PaginatedPersonalRepresentativeAccessDto,
    },
  })
  @Audit<PaginatedPersonalRepresentativeAccessDto>({
    resources: (pgData) => pgData.data.map((access) => access.id ?? ''),
  })
  async getAll(
    @Query() query: PaginationWithNationalIdsDto,
  ): Promise<PaginatedPersonalRepresentativeAccessDto> {
    return this.personalRepresentativeAccessService.getMany(query)
  }
}
