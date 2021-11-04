import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'

import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { MunicipalityService } from './municipality.service'
import { MunicipalityModel } from './models'

import { apiBasePath } from '@island.is/financial-aid/shared/lib'
import { IdsUserGuard } from '@island.is/auth-nest-tools'

@UseGuards(IdsUserGuard)
@Controller(apiBasePath)
@ApiTags('municipality')
export class MunicipalityController {
  constructor(private readonly municipalityService: MunicipalityService) {}

  @Get('municipality/:id')
  @ApiOkResponse({
    type: MunicipalityModel,
    description: 'Gets municipality',
  })
  async getById(@Param('id') id: string): Promise<MunicipalityModel> {
    const municipality = await this.municipalityService.findByMunicipalityId(id)

    if (!municipality) {
      throw new NotFoundException(`municipality ${id} not found`)
    }

    return municipality
  }
}
