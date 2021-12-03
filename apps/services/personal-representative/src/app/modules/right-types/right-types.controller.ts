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
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger'
import { AuthGuard } from '../common'

@ApiTags('Right Types')
@Controller('v1/right-types')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class RightTypesController {
  constructor(
    @Inject(PersonalRepresentativeRightTypeService)
    private readonly rightTypesService: PersonalRepresentativeRightTypeService,
  ) {}

  /** Gets all right types */
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
  @Delete(':code')
  @ApiOkResponse()
  async removeAsync(@Param('code') code: string): Promise<number> {
    if (!code) {
      throw new BadRequestException('Key needs to be provided')
    }

    return await this.rightTypesService.deleteAsync(code)
  }

  /** Creates a right type */
  @Post()
  @ApiCreatedResponse({ type: PersonalRepresentativeRightType })
  async create(
    @Body() rightType: PersonalRepresentativeRightTypeDTO,
  ): Promise<PersonalRepresentativeRightType> {
    return await this.rightTypesService.createAsync(rightType)
  }

  /** Updates a right type */
  @Put(':code')
  @ApiCreatedResponse({ type: PersonalRepresentativeRightType })
  async update(
    @Param('code') code: string,
    @Body() rightType: PersonalRepresentativeRightTypeDTO,
  ): Promise<PersonalRepresentativeRightType> {
    if (!code) {
      throw new BadRequestException('Code must be provided')
    }

    const result = await this.rightTypesService.updateAsync(code, rightType)
    if (result == null) {
      throw new NotFoundException("This particular right type doesn't exist")
    }

    return result
  }
}
