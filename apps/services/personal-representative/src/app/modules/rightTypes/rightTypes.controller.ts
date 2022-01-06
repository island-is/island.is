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
} from '@nestjs/common'
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { environment } from '../../../environments'
import { AuditService, Audit } from '@island.is/nest/audit'
import { PaginationDto } from '@island.is/nest/pagination'

const namespace = `${environment.audit.defaultNamespace}/right-types`

@UseGuards(IdsAuthGuard, ScopesGuard)
@Scopes(AuthScope.writePersonalRepresentative)
@ApiBearerAuth()
@ApiTags('Right Types')
@Controller('v1/right-types')
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
    const rightTypes = await this.rightTypesService.getMany(query)

    return rightTypes
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
  @ApiOkResponse()
  async removeAsync(
    @Param('code') code: string,
    @CurrentAuth() auth: Auth,
  ): Promise<number> {
    if (!code) {
      throw new BadRequestException('Key needs to be provided')
    }
    // delete right type
    return await this.auditService.auditPromise(
      {
        user,
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
    @CurrentAuth() auth: Auth,
  ): Promise<PersonalRepresentativeRightType> {
    // Create a new right type
    return await this.auditService.auditPromise(
      {
        auth,
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
  @ApiCreatedResponse({ type: PersonalRepresentativeRightType })
  @Audit<PersonalRepresentativeRightType>({
    resources: (type) => type.code,
  })
  async update(
    @Param('code') code: string,
    @Body() rightType: PersonalRepresentativeRightTypeDTO,
    @CurrentAuth() auth: Auth,
  ): Promise<PersonalRepresentativeRightType> {
    if (!code) {
      throw new BadRequestException('Code must be provided')
    }

    // Update right type
    const result = await this.auditService.auditPromise(
      {
        auth,
        action: 'updatePersonalRepresentativeRightType',
        namespace,
        resources: rightType.code,
        meta: { fields: Object.keys(rightType) },
      },
      this.rightTypesService.update(code, rightType),
    )

    if (result == null) {
      throw new NotFoundException("This particular right type doesn't exist")
    }

    return result
  }
}
