import { AuthScope } from '@island.is/auth/scopes'
import {
  PersonalRepresentativeAccessService,
  PaginatedPersonalRepresentativeAccessDto,
} from '@island.is/auth-api-lib/personal-representative'
import {
  Controller,
  UseGuards,
  Get,
  Inject,
  Query,
  Param,
} from '@nestjs/common'
import {
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { environment } from '../../../environments'
import { Audit } from '@island.is/nest/audit'
import { PaginationDto } from '@island.is/nest/pagination'

const namespace = `${environment.audit.defaultNamespace}/access-logs`

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AuthScope.writePersonalRepresentative)
@ApiTags('Personal Representative - Access logs')
@Controller('v1/access-logs')
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
    @Query() query: PaginationDto,
  ): Promise<PaginatedPersonalRepresentativeAccessDto> {
    return await this.personalRepresentativeAccessService.getMany(query)
  }

  /** Gets all access logs by personal representative */
  @ApiOperation({
    summary: 'Get a list of all logged accesses by personal representative',
  })
  @Get(':nationalId/personal-representative')
  @ApiParam({ name: 'nationalId', required: true, type: String })
  @ApiOkResponse({ type: PaginatedPersonalRepresentativeAccessDto })
  @Audit<PaginatedPersonalRepresentativeAccessDto>({
    resources: (pgData) => pgData.data.map((access) => access.id),
  })
  async getByPersonalRepresentative(
    @Param('nationalId') nationalId: string,
    @Query() query: PaginationDto,
  ): Promise<PaginatedPersonalRepresentativeAccessDto> {
    console.log(nationalId)
    return await this.personalRepresentativeAccessService.getByPersonalRepresentative(
      nationalId,
      query,
    )
  }

  /** Gets all access logs by represented person */
  @ApiOperation({
    summary: 'Get a list of all logged accesses by personal representative',
  })
  @Get(':nationalId/represented-person')
  @ApiParam({ name: 'nationalId', required: true, type: String })
  @ApiOkResponse({ type: PaginatedPersonalRepresentativeAccessDto })
  @Audit<PaginatedPersonalRepresentativeAccessDto>({
    resources: (pgData) => pgData.data.map((access) => access.id),
  })
  async getByRepresentedPerson(
    @Param('nationalId') nationalId: string,
    @Query() query: PaginationDto,
  ): Promise<PaginatedPersonalRepresentativeAccessDto> {
    console.log(nationalId)
    return await this.personalRepresentativeAccessService.getByRepresentedPerson(
      nationalId,
      query,
    )
  }
}
