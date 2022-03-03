import { Controller, Get, Inject, Query,UseGuards } from '@nestjs/common'
import { ApiBearerAuth,ApiTags } from '@nestjs/swagger'

import { AuthScope } from '@island.is/auth/scopes'
import {
  PaginatedPersonalRepresentativeAccessDto,
  PaginationWithNationalIdsDto,
  PersonalRepresentativeAccessService,
} from '@island.is/auth-api-lib/personal-representative'
import { IdsAuthGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'

import { environment } from '../../../environments'

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
    resources: (pgData) => pgData.data.map((access) => access.id),
  })
  async getAll(
    @Query() query: PaginationWithNationalIdsDto,
  ): Promise<PaginatedPersonalRepresentativeAccessDto> {
    return this.personalRepresentativeAccessService.getMany(query)
  }
}
