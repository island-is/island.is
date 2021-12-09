import {
  PersonalRepresentativeType,
  PersonalRepresentativeTypeDTO,
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
  Req,
} from '@nestjs/common'
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger'
import { AuthGuard } from '../common'
import type { HttpRequest } from '../../app.types'
import { User } from '@island.is/auth-nest-tools'
import { environment } from '../../../environments'
import { AuditService } from '@island.is/nest/audit'

const namespace = `${environment.audit.defaultNamespace}/personal-representative-types`

@ApiTags('Personal Representative Types')
@Controller('v1/personal-representative-types')
@UseGuards(AuthGuard)
@ApiBearerAuth()
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
  @ApiOkResponse({ type: PersonalRepresentativeType })
  async getAll(): Promise<PersonalRepresentativeType[]> {
    const personalRepresentativeTypes = await this.personalRepresentativeTypesService.getAllAsync()

    if (!personalRepresentativeTypes) {
      throw new NotFoundException('No personal representative types found')
    }

    return personalRepresentativeTypes
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

    const personalRepresentativeType = await this.personalRepresentativeTypesService.getPersonalRepresentativeTypeAsync(
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
  @ApiOkResponse()
  async removeAsync(
    @Param('code') code: string,
    @Req() request: HttpRequest,
  ): Promise<number> {
    if (!code) {
      throw new BadRequestException('Key needs to be provided')
    }

    // Since we do not have an island.is user login we need to create a user object
    const user: User = {
      nationalId: '',
      scope: [],
      authorization: '',
      client: request.childService,
    }
    // delete right type
    return await this.auditService.auditPromise(
      {
        user,
        action: 'deletePersonalRepresentativeType',
        namespace,
        resources: code,
      },
      this.personalRepresentativeTypesService.deleteAsync(code),
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
    @Req() request: HttpRequest,
  ): Promise<PersonalRepresentativeType> {
    // Since we do not have an island.is user login we need to create a user object
    const user: User = {
      nationalId: '',
      scope: [],
      authorization: '',
      client: request.childService,
    }
    // Create a new right type
    return await this.auditService.auditPromise(
      {
        user,
        action: 'createPersonalRepresentativeType',
        namespace,
        resources: rightType.code,
        meta: { fields: Object.keys(rightType) },
      },
      this.personalRepresentativeTypesService.createAsync(rightType),
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
    @Req() request: HttpRequest,
  ): Promise<PersonalRepresentativeType> {
    if (!code) {
      throw new BadRequestException('Code must be provided')
    }

    // Since we do not have an island.is user login we need to create a user object
    const user: User = {
      nationalId: '',
      scope: [],
      authorization: '',
      client: request.childService,
    }

    // Update right type
    const result = await this.auditService.auditPromise(
      {
        user,
        action: 'updatePersonalRepresentativeType',
        namespace,
        resources: rightType.code,
        meta: { fields: Object.keys(rightType) },
      },
      this.personalRepresentativeTypesService.updateAsync(code, rightType),
    )

    if (result == null) {
      throw new NotFoundException("This particular type doesn't exist")
    }

    return result
  }
}
