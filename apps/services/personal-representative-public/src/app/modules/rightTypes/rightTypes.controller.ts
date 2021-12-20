import { AuthScope } from '@island.is/auth/scopes'
import {
  PaginatedPersonalRepresentativeRightTypeDto,
  PersonalRepresentativeRightType,
  PersonalRepresentativeRightTypeService,
} from '@island.is/auth-api-lib/personal-representative'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import {
  BadRequestException,
  Controller,
  UseGuards,
  Get,
  NotFoundException,
  Param,
  Inject,
  Query,
} from '@nestjs/common'
import {
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger'
import { Audit } from '@island.is/nest/audit'
import { PaginationDto } from '@island.is/nest/pagination'
import { environment } from '../../../environments'

const namespace = `${environment.audit.defaultNamespace}/right-types`

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AuthScope.readPersonalRepresentative)
@ApiTags('Personal Representative Public - Right Types')
@Controller('v1/right-types')
@ApiBearerAuth()
@Audit({ namespace })
export class RightTypesController {
  constructor(
    @Inject(PersonalRepresentativeRightTypeService)
    private readonly rightTypesService: PersonalRepresentativeRightTypeService,
  ) {}

  /** Gets all right types */
  @ApiOperation({
    summary: 'Get a list of all right types for personal representatives',
  })
  @Get()
  @ApiOkResponse({ type: PaginatedPersonalRepresentativeRightTypeDto })
  @Audit<PaginatedPersonalRepresentativeRightTypeDto>({
    resources: (pgData) => pgData.data.map((type) => type.code),
  })
  async getMany(
    @Query() query: PaginationDto,
  ): Promise<PaginatedPersonalRepresentativeRightTypeDto> {
    const rightTypes = await this.rightTypesService.getMany(query)

    return rightTypes
  }

  /** Gets a right type by it's key */
  @ApiOperation({
    summary: 'Get a single right type by code',
  })
  @Get(':code')
  @ApiOkResponse({ type: PersonalRepresentativeRightType })
  async get(
    @Param('code') code: string,
  ): Promise<PersonalRepresentativeRightType> {
    if (!code) {
      throw new BadRequestException('Code needs to be provided')
    }

    const rightType = await this.rightTypesService.getPersonalRepresentativeRightType(
      code,
    )

    if (!rightType) {
      throw new NotFoundException("This particular right type doesn't exist")
    }

    return rightType
  }
}
