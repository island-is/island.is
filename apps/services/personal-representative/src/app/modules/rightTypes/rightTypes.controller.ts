import {
  PersonalRepresentativeRightType,
  PersonalRepresentativeRightTypeDTO,
  PersonalRepresentativeRightTypeService,
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

const namespace = `${environment.audit.defaultNamespace}/right-types`

@ApiTags('Right Types')
@Controller('v1/right-types')
@UseGuards(AuthGuard)
@ApiBearerAuth()
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
  @ApiOkResponse({ type: PersonalRepresentativeRightType })
  async getAll(): Promise<PersonalRepresentativeRightType[]> {
    const rightTypes = await this.rightTypesService.getAllAsync()

    if (!rightTypes) {
      throw new NotFoundException('No right types found')
    }

    return rightTypes
  }

  /** Gets a right type by it's key */
  @ApiOperation({
    summary: 'Get a single right type by code',
  })
  @Get(':code')
  @ApiOkResponse({ type: PersonalRepresentativeRightType })
  async getAsync(
    @Param('code') code: string,
  ): Promise<PersonalRepresentativeRightType> {
    if (!code) {
      throw new BadRequestException('Code needs to be provided')
    }

    const rightType = await this.rightTypesService.getPersonalRepresentativeRightTypeAsync(
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
        action: 'deletePersonalRepresentativeRightType',
        namespace,
        resources: code,
      },
      this.rightTypesService.deleteAsync(code)
    )
  }

  /** Creates a right type */
  @ApiOperation({
    summary: 'Create a right type',
  })
  @Post()
  @ApiCreatedResponse({ type: PersonalRepresentativeRightType })
  async create(
    @Body() rightType: PersonalRepresentativeRightTypeDTO,
    @Req() request: HttpRequest,
  ): Promise<PersonalRepresentativeRightType> {
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
        action: 'createPersonalRepresentativeRightType',
        namespace,
        resources: rightType.code,
        meta: { fields: Object.keys(rightType) },
      },
      this.rightTypesService.createAsync(rightType)
    )
  }

  /** Updates a right type */
  @ApiOperation({
    summary: 'Update a right type by code',
  })
  @Put(':code')
  @ApiCreatedResponse({ type: PersonalRepresentativeRightType })
  async update(
    @Param('code') code: string,
    @Body() rightType: PersonalRepresentativeRightTypeDTO,
    @Req() request: HttpRequest,
  ): Promise<PersonalRepresentativeRightType> {
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
        action: 'updatePersonalRepresentativeRightType',
        namespace,
        resources: rightType.code,
        meta: { fields: Object.keys(rightType) },
      },
      this.rightTypesService.updateAsync(code, rightType)
    )

    if (result == null) {
      throw new NotFoundException("This particular right type doesn't exist")
    }

    return result
  }
}
