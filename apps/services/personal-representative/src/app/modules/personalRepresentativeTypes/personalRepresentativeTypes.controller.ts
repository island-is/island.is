import { AuthScope } from '@island.is/auth/scopes'
import {
  PersonalRepresentativeType,
  PersonalRepresentativeTypeDTO,
  PaginatedPersonalRepresentativeTypeDto,
  PersonalRepresentativeTypeService,
} from '@island.is/auth-api-lib/personal-representative'
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
  ApiBearerAuth,
  ApiTags,
  ApiNoContentResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger'
import {
  CurrentAuth,
  IdsAuthGuard,
  Scopes,
  ScopesGuard,
  Auth,
} from '@island.is/auth-nest-tools'
import { environment } from '../../../environments'
import { Audit, AuditService } from '@island.is/nest/audit'
import { PaginationDto } from '@island.is/nest/pagination'
import { HttpProblemResponse } from '@island.is/nest/problem'

const namespace = `${environment.audit.defaultNamespace}/personal-representative-types`

@UseGuards(IdsAuthGuard, ScopesGuard)
@Scopes(AuthScope.writePersonalRepresentative)
@ApiTags('Personal Representative Types')
@Controller('v1/personal-representative-types')
@ApiForbiddenResponse({ type: HttpProblemResponse })
@ApiUnauthorizedResponse({ type: HttpProblemResponse })
@ApiBadRequestResponse({ type: HttpProblemResponse })
@ApiInternalServerErrorResponse()
@ApiBearerAuth()
@Audit({ namespace })
export class PersonalRepresentativeTypesController {
  constructor(
    @Inject(PersonalRepresentativeTypeService)
    private readonly personalRepresentativeTypesService: PersonalRepresentativeTypeService,
    private readonly auditService: AuditService,
  ) {}

  /** Gets all right types */
  @ApiOperation({
    summary:
      'Get a list of all personal representative types for personal representatives',
  })
  @Get()
  @ApiOkResponse({ type: PaginatedPersonalRepresentativeTypeDto })
  @Audit<PaginatedPersonalRepresentativeTypeDto>({
    resources: (pgData) => pgData.data.map((type) => type.code),
  })
  async getAll(
    @Query() query: PaginationDto,
  ): Promise<PaginatedPersonalRepresentativeTypeDto> {
    return this.personalRepresentativeTypesService.getMany(query)
  }

  /** Gets a right type by it's key */
  @ApiOperation({
    summary: 'Get a single personal representative type by code',
  })
  @Get(':code')
  @ApiOkResponse({ type: PersonalRepresentativeType })
  async getAsync(
    @Param('code') code: string,
  ): Promise<PersonalRepresentativeType> {
    if (!code) {
      throw new BadRequestException('Code needs to be provided')
    }

    const personalRepresentativeType = await this.personalRepresentativeTypesService.getPersonalRepresentativeType(
      code,
    )

    if (!personalRepresentativeType) {
      throw new NotFoundException("This particular right type doesn't exist")
    }

    return personalRepresentativeType
  }
  /** Removes a right type by it's code, by making it invalid */
  @ApiOperation({
    summary: 'Delete a single personal representative type by code',
  })
  @Delete(':code')
  @HttpCode(204)
  @ApiNoContentResponse()
  async removeAsync(
    @Param('code') code: string,
    @CurrentAuth() user: Auth,
  ): Promise<void> {
    if (!code) {
      throw new BadRequestException('Key needs to be provided')
    }

    // delete right type
    await this.auditService.auditPromise(
      {
        user,
        action: 'deletePersonalRepresentativeType',
        namespace,
        resources: code,
      },
      this.personalRepresentativeTypesService.delete(code),
    )
  }

  /** Creates a right type */
  @ApiOperation({
    summary: 'Create a personal representative type',
  })
  @Post()
  @ApiCreatedResponse({ type: PersonalRepresentativeType })
  async create(
    @Body() rightType: PersonalRepresentativeTypeDTO,
    @CurrentAuth() user: Auth,
  ): Promise<PersonalRepresentativeType> {
    // Create a new right type
    return this.auditService.auditPromise(
      {
        user,
        action: 'createPersonalRepresentativeType',
        namespace,
        resources: rightType.code,
        meta: { fields: Object.keys(rightType) },
      },
      this.personalRepresentativeTypesService.create(rightType),
    )
  }

  /** Updates a right type */
  @ApiOperation({
    summary: 'Update a personal representative type by code',
  })
  @Put(':code')
  @ApiCreatedResponse({ type: PersonalRepresentativeType })
  async update(
    @Param('code') code: string,
    @Body() rightType: PersonalRepresentativeTypeDTO,
    @CurrentAuth() user: Auth,
  ): Promise<PersonalRepresentativeType | null> {
    // Update right type
    return this.auditService.auditPromise(
      {
        user,
        action: 'updatePersonalRepresentativeType',
        namespace,
        resources: rightType.code,
        meta: { fields: Object.keys(rightType) },
      },
      this.personalRepresentativeTypesService.update(code, rightType),
    )
  }
}
