import { AuthScope } from '@island.is/auth/scopes'
import {
  PaginatedPersonalRepresentativeRightTypeDto,
  PersonalRepresentativeRightType,
  PersonalRepresentativeRightTypeDTO,
  PersonalRepresentativeRightTypeService,
} from '@island.is/auth-api-lib/personal-representative'
import {
  CurrentAuth,
  IdsAuthGuard,
  Scopes,
  ScopesGuard,
  Auth,
} from '@island.is/auth-nest-tools'
import {
  BadRequestException,
  Body,
  Controller,
  UseGuards,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Inject,
  Query,
  HttpCode,
} from '@nestjs/common'
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger'
import { environment } from '../../../environments'
import { AuditService, Audit } from '@island.is/nest/audit'
import { PaginationDto } from '@island.is/nest/pagination'
import { HttpProblemResponse } from '@island.is/nest/problem'

const namespace = `${environment.audit.defaultNamespace}/right-types`

@UseGuards(IdsAuthGuard, ScopesGuard)
@Scopes(AuthScope.adminPersonalRepresentative)
@ApiBearerAuth()
@ApiTags('Right Types')
@Controller('v1/right-types')
@ApiForbiddenResponse({ type: HttpProblemResponse })
@ApiUnauthorizedResponse({ type: HttpProblemResponse })
@ApiBadRequestResponse({ type: HttpProblemResponse })
@ApiInternalServerErrorResponse()
@Audit({ namespace })
export class RightTypesController {
  constructor(
    @Inject(PersonalRepresentativeRightTypeService)
    private readonly rightTypesService: PersonalRepresentativeRightTypeService,
    private readonly auditService: AuditService,
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
  async getAll(
    @Query() query: PaginationDto,
  ): Promise<PaginatedPersonalRepresentativeRightTypeDto> {
    return this.rightTypesService.getMany(query)
  }

  /** Gets a right type by it's key */
  @ApiOperation({
    summary: 'Get a single right type by code',
  })
  @Get(':code')
  @ApiOkResponse({ type: PersonalRepresentativeRightType })
  @Audit<PersonalRepresentativeRightType>({
    resources: (type) => type.code,
  })
  async getAsync(
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
  /** Removes a right type by it's code, by making it invalid */
  @ApiOperation({
    summary: 'Delete a single right type by code',
  })
  @Delete(':code')
  @HttpCode(204)
  @ApiNoContentResponse()
  async removeAsync(
    @Param('code') code: string,
    @CurrentAuth() user: Auth,
  ): Promise<void> {
    if (!code) {
      throw new BadRequestException('Code needs to be provided')
    }
    // delete right type
    await this.auditService.auditPromise(
      {
        auth: user,
        action: 'deletePersonalRepresentativeRightType',
        namespace,
        resources: code,
      },
      this.rightTypesService.delete(code),
    )
  }

  /** Creates a right type */
  @ApiOperation({
    summary: 'Create a right type',
  })
  @Post()
  @ApiCreatedResponse({ type: PersonalRepresentativeRightType })
  @Audit<PersonalRepresentativeRightType>({
    resources: (type) => type.code,
  })
  async create(
    @Body() rightType: PersonalRepresentativeRightTypeDTO,
    @CurrentAuth() user: Auth,
  ): Promise<PersonalRepresentativeRightType> {
    // Create a new right type
    return this.auditService.auditPromise(
      {
        auth: user,
        action: 'createPersonalRepresentativeRightType',
        namespace,
        resources: rightType.code,
        meta: { fields: Object.keys(rightType) },
      },
      this.rightTypesService.create(rightType),
    )
  }

  /** Updates a right type */
  @ApiOperation({
    summary: 'Update a right type by code',
  })
  @Put(':code')
  @ApiOkResponse({ type: PersonalRepresentativeRightType })
  @Audit<PersonalRepresentativeRightType>({
    resources: (type) => type.code,
  })
  async update(
    @Param('code') code: string,
    @Body() rightType: PersonalRepresentativeRightTypeDTO,
    @CurrentAuth() user: Auth,
  ): Promise<PersonalRepresentativeRightType | null> {
    // Update right type
    return this.auditService.auditPromise(
      {
        auth: user,
        action: 'updatePersonalRepresentativeRightType',
        namespace,
        resources: rightType.code,
        meta: { fields: Object.keys(rightType) },
      },
      this.rightTypesService.update(code, rightType),
    )
  }
}
