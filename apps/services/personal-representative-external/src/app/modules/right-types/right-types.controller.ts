import {
  PersonalRepresentativeRightType,
  PersonalRepresentativeRightTypeService,
} from '@island.is/auth-api-lib/personal-representative'
import {
  BadRequestException,
  Controller,
  UseGuards,
  Get,
  NotFoundException,
  Param,
  Inject,
} from '@nestjs/common'
import {
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger'
import { AuthGuard } from '../common'

@ApiTags('Personal Representative External - Right Types')
@Controller('v1/right-types')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class RightTypesController {
  constructor(
    @Inject(PersonalRepresentativeRightTypeService)
    private readonly rightTypesService: PersonalRepresentativeRightTypeService,
  ) {}

  /** Gets all right types */
  @ApiOperation({
    summary: 'Get a list of all right types for personal representatives',
  })
  @Get('/right-types')
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
  @Get('/right-types/:code')
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
}
