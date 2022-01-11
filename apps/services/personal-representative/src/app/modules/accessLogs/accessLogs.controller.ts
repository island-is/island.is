import { AuthScope } from '@island.is/auth/scopes'
import {
  PersonalRepresentativeAccessService,
  PaginatedPersonalRepresentativeAccessDto,
} from '@island.is/auth-api-lib/personal-representative'
import { Controller, UseGuards, Get, Inject, Query } from '@nestjs/common'
import {
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiTags,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger'
import { IdsAuthGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { environment } from '../../../environments'
import { Audit } from '@island.is/nest/audit'
import { HttpProblemResponse } from '@island.is/nest/problem'
import { PaginationWithNationalIdsDto } from '../dto/PaginationWithNationalIds.dto'
import { Op } from 'sequelize'

const namespace = `${environment.audit.defaultNamespace}/access-logs`

@UseGuards(IdsAuthGuard, ScopesGuard)
@Scopes(AuthScope.writePersonalRepresentative)
@ApiTags('Access logs')
@Controller('v1/access-logs')
@ApiForbiddenResponse({ type: HttpProblemResponse })
@ApiUnauthorizedResponse({ type: HttpProblemResponse })
@ApiBadRequestResponse({ type: HttpProblemResponse })
@ApiInternalServerErrorResponse()
@ApiBearerAuth()
@Audit({ namespace })
export class AccessLogsController {
  constructor(
    @Inject(PersonalRepresentativeAccessService)
    private readonly personalRepresentativeAccessService: PersonalRepresentativeAccessService,
  ) {}

  /** Gets all access logs  */
  @ApiOperation({
    summary: 'Get a list of all logged accesses',
  })
  @Get()
  @ApiOkResponse({ type: PaginatedPersonalRepresentativeAccessDto })
  @Audit<PaginatedPersonalRepresentativeAccessDto>({
    resources: (pgData) => pgData.data.map((access) => access.id),
  })
  async getAll(
    @Query() query: PaginationWithNationalIdsDto,
  ): Promise<PaginatedPersonalRepresentativeAccessDto> {
    const where =
      query.personalRepresentativeId && query.representedPersonId
        ? {
            [Op.and]: [
              {
                nationalIdPersonalRepresentative:
                  query.personalRepresentativeId,
              },
              {
                nationalIdRepresentedPerson: query.representedPersonId,
              },
            ],
          }
        : query.personalRepresentativeId
        ? {
            nationalIdPersonalRepresentative: query.personalRepresentativeId,
          }
        : query.representedPersonId
        ? {
            nationalIdRepresentedPerson: query.representedPersonId,
          }
        : {}

    return this.personalRepresentativeAccessService.getMany(query, where)
  }
}
