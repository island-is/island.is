import { AuthScope } from '@island.is/auth/scopes'
import {
  PersonalRepresentativeTypeDTO,
  PaginatedPersonalRepresentativeTypeDto,
  PersonalRepresentativeTypeService,
} from '@island.is/auth-api-lib'
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
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { Documentation } from '@island.is/nest/swagger'
import type { Auth } from '@island.is/auth-nest-tools'
import {
  CurrentAuth,
  IdsAuthGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { environment } from '../../../environments'
import { Audit, AuditService } from '@island.is/nest/audit'
import { PaginationDto } from '@island.is/nest/pagination'

const namespace = `${environment.audit.defaultNamespace}/personal-representative-types`

@UseGuards(IdsAuthGuard, ScopesGuard)
@Scopes(AuthScope.adminPersonalRepresentative)
@ApiTags('Personal Representative Types')
@Controller('v1/personal-representative-types')
@ApiBearerAuth()
@Audit({ namespace })
export class PersonalRepresentativeTypesController {
  constructor(
    @Inject(PersonalRepresentativeTypeService)
    private readonly personalRepresentativeTypesService: PersonalRepresentativeTypeService,
    private readonly auditService: AuditService,
  ) {}

  /** Gets all right types */
  @Get()
  @Documentation({
    summary:
      'Get a list of all personal representative types for personal representatives',
    response: { status: 200, type: PaginatedPersonalRepresentativeTypeDto },
  })
  @Audit<PaginatedPersonalRepresentativeTypeDto>({
    resources: (pgData) => pgData.data.map((type) => type.code),
  })
  async getAll(
    @Query() query: PaginationDto,
  ): Promise<PaginatedPersonalRepresentativeTypeDto> {
    return this.personalRepresentativeTypesService.getMany(query)
  }

  /** Gets a right type by it's key */
  @Get(':code')
  @Documentation({
    summary: 'Get a single personal representative type by code',
    response: { status: 200, type: PaginatedPersonalRepresentativeTypeDto },
    request: {
      params: {
        code: {
          required: true,
          description: 'Unique code for a type',
          type: String,
        },
      },
    },
  })
  async getAsync(
    @Param('code') code: string,
  ): Promise<PersonalRepresentativeTypeDTO> {
    if (!code) {
      throw new BadRequestException('Code needs to be provided')
    }

    const personalRepresentativeType =
      await this.personalRepresentativeTypesService.getPersonalRepresentativeType(
        code,
      )

    if (!personalRepresentativeType) {
      throw new NotFoundException("This particular right type doesn't exist")
    }

    return personalRepresentativeType
  }
  /** Removes a right type by it's code, by making it invalid */
  @Delete(':code')
  @Documentation({
    summary:
      'Mark a single personal representative type invalid by code. Note that the type is not deleted but marked as invalid.',
    response: { status: 204 },
    request: {
      params: {
        code: {
          required: true,
          description: 'Unique code for a type',
          type: String,
        },
      },
    },
  })
  async removeAsync(
    @Param('code') code: string,
    @CurrentAuth() user: Auth,
  ): Promise<void> {
    // delete right type
    await this.auditService.auditPromise(
      {
        auth: user,
        action: 'deletePersonalRepresentativeType',
        namespace,
        resources: code,
      },
      this.personalRepresentativeTypesService.delete(code),
    )
  }

  /** Creates a right type */
  @Post()
  @Documentation({
    summary: 'Create a personal representative type',
    response: { status: 201, type: PersonalRepresentativeTypeDTO },
  })
  async create(
    @Body() rightType: PersonalRepresentativeTypeDTO,
    @CurrentAuth() user: Auth,
  ): Promise<PersonalRepresentativeTypeDTO> {
    // Create a new right type
    return this.auditService.auditPromise(
      {
        auth: user,
        action: 'createPersonalRepresentativeType',
        namespace,
        resources: rightType.code,
        meta: { fields: Object.keys(rightType) },
      },
      this.personalRepresentativeTypesService.create(rightType),
    )
  }

  /** Updates a right type */
  @Put(':code')
  @Documentation({
    summary: 'Update a personal representative type by code',
    response: { status: 200, type: PersonalRepresentativeTypeDTO },
    request: {
      params: {
        code: {
          required: true,
          description: 'Unique code for a type',
          type: String,
        },
      },
    },
  })
  async update(
    @Param('code') code: string,
    @Body() rightType: PersonalRepresentativeTypeDTO,
    @CurrentAuth() user: Auth,
  ): Promise<PersonalRepresentativeTypeDTO | null> {
    // Update right type
    return this.auditService.auditPromise(
      {
        auth: user,
        action: 'updatePersonalRepresentativeType',
        namespace,
        resources: rightType.code,
        meta: { fields: Object.keys(rightType) },
      },
      this.personalRepresentativeTypesService.update(code, rightType),
    )
  }
}
