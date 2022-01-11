import { AuthScope } from '@island.is/auth/scopes'
import {
  PaginatedPersonalRepresentativeRightTypeDto,
  PersonalRepresentativeRightType,
  PersonalRepresentativeRightTypeService,
} from '@island.is/auth-api-lib/personal-representative'
import { IdsAuthGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
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
  ApiParam,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger'
import { Audit } from '@island.is/nest/audit'
import { PaginationDto } from '@island.is/nest/pagination'
import { environment } from '../../../environments'
import { HttpProblemResponse } from '@island.is/nest/problem'

const namespace = `${environment.audit.defaultNamespace}/rights`

@UseGuards(IdsAuthGuard, ScopesGuard)
@Scopes(AuthScope.publicPersonalRepresentative)
@ApiBearerAuth()
@ApiTags('Right Types - Public')
@Controller('v1/rights')
@ApiForbiddenResponse({ type: HttpProblemResponse })
@ApiUnauthorizedResponse({ type: HttpProblemResponse })
@ApiBadRequestResponse({ type: HttpProblemResponse })
@ApiInternalServerErrorResponse()
@Audit({ namespace })
export class RightsController {
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
    return await this.rightTypesService.getMany(query)
  }

  /** Gets a right type by it's key */
  @ApiOperation({
    summary: 'Get a single right type by code',
  })
  @ApiParam({
    name: 'code',
    description: 'Unique code for a specific right type',
    required: true,
    type: String,
  })
  @Get(':code')
  @ApiOkResponse({ type: PersonalRepresentativeRightType })
  @ApiNotFoundResponse({ type: HttpProblemResponse })
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
