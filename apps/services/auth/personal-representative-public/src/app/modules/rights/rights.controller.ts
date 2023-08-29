import { AuthScope } from '@island.is/auth/scopes'
import {
  PaginatedPersonalRepresentativeRightTypeDto,
  PersonalRepresentativeRightTypeDTO,
  PersonalRepresentativeRightTypeService,
} from '@island.is/auth-api-lib'
import { IdsAuthGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import {
  Controller,
  UseGuards,
  Get,
  NotFoundException,
  Param,
  Inject,
  Query,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { Documentation } from '@island.is/nest/swagger'
import { Audit } from '@island.is/nest/audit'
import { PaginationDto } from '@island.is/nest/pagination'
import { environment } from '../../../environments'

const namespace = `${environment.audit.defaultNamespace}/rights`

@UseGuards(IdsAuthGuard, ScopesGuard)
@Scopes(AuthScope.publicPersonalRepresentative)
@ApiBearerAuth()
@ApiTags('Right Types - Public')
@Controller('v1/rights')
@Audit({ namespace })
export class RightsController {
  constructor(
    @Inject(PersonalRepresentativeRightTypeService)
    private readonly rightTypesService: PersonalRepresentativeRightTypeService,
  ) {}

  /** Gets all right types */
  @Get()
  @Documentation({
    summary: 'Get a list of all right types for personal representatives',
    response: {
      status: 200,
      type: PaginatedPersonalRepresentativeRightTypeDto,
    },
  })
  @Audit<PaginatedPersonalRepresentativeRightTypeDto>({
    resources: (pgData) => pgData.data.map((type) => type.code),
  })
  async getMany(
    @Query() query: PaginationDto,
  ): Promise<PaginatedPersonalRepresentativeRightTypeDto> {
    return this.rightTypesService.getMany(query)
  }

  /** Gets a right type by it's key */
  @Get(':code')
  @Documentation({
    summary: 'Get a single right type by code',
    response: {
      status: 200,
      type: PersonalRepresentativeRightTypeDTO,
    },
    request: {
      params: {
        code: {
          required: true,
          description: 'Unique code for a specific right type',
          type: String,
        },
      },
    },
  })
  async get(
    @Param('code') code: string,
  ): Promise<PersonalRepresentativeRightTypeDTO> {
    const rightType =
      await this.rightTypesService.getPersonalRepresentativeRightType(code)

    if (!rightType) {
      throw new NotFoundException("This particular right type doesn't exist")
    }

    return rightType
  }
}
