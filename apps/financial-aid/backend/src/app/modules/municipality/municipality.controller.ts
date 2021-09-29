import {
  Body,
  Controller,
  Get,
  Post,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'

import { ApiOkResponse, ApiTags, ApiCreatedResponse } from '@nestjs/swagger'

import { MunicipalityService } from './municipality.service'
import { MunicipalityModel } from './models'

import {
  apiBasePath,
  Municipality,
  MunicipalitySettings,
} from '@island.is/financial-aid/shared/lib'

import { TokenGuard } from '@island.is/financial-aid/auth'

@UseGuards(TokenGuard)
@Controller(apiBasePath)
@ApiTags('municipality')
export class MunicipalityController {
  constructor(private readonly municipalityService: MunicipalityService) {}

  @Get('municipality/:id')
  @ApiOkResponse({
    type: MunicipalityModel,
    description: 'Gets municipality',
  })
  async getById(@Param('id') id: string): Promise<Municipality> {
    const municipality = await this.municipalityService.findById(id)

    if (!municipality) {
      throw new NotFoundException(`municipality ${id} not found`)
    }

    return municipality
  }
}
