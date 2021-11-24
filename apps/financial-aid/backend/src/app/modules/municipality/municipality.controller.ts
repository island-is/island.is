import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'

import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { MunicipalityService } from './municipality.service'
import { MunicipalityModel } from './models'

import { apiBasePath, StaffRole } from '@island.is/financial-aid/shared/lib'
import type { Staff } from '@island.is/financial-aid/shared/lib'
import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { StaffGuard } from '../../guards/staff.guard'
import { StaffRolesRules } from '../../decorators/staffRole.decorator'
import { CurrentStaff } from '../../decorators'
import { CreateMunicipalityDto, UpdateMunicipalityDto } from './dto'
import { CreateStaffDto } from '../staff/dto'

@UseGuards(IdsUserGuard)
@Controller(`${apiBasePath}/municipality`)
@ApiTags('municipality')
export class MunicipalityController {
  constructor(private readonly municipalityService: MunicipalityService) {}

  @Get(':id')
  @ApiOkResponse({
    type: MunicipalityModel,
    description: 'Gets municipality by id',
  })
  async getById(@Param('id') id: string): Promise<MunicipalityModel> {
    const municipality = await this.municipalityService.findByMunicipalityId(id)

    if (!municipality) {
      throw new NotFoundException(`municipality ${id} not found`)
    }

    return municipality
  }

  @UseGuards(StaffGuard)
  @StaffRolesRules(StaffRole.SUPERADMIN)
  @Post('')
  @ApiCreatedResponse({
    type: MunicipalityModel,
    description: 'Creates a new municipality',
  })
  create(
    @Body()
    input: {
      municipalityInput: CreateMunicipalityDto
      adminInput: CreateStaffDto
    },
  ): Promise<MunicipalityModel> {
    return this.municipalityService.create(
      input.municipalityInput,
      input.adminInput,
    )
  }

  @UseGuards(StaffGuard)
  @StaffRolesRules(StaffRole.SUPERADMIN)
  @Get('')
  @ApiOkResponse({
    type: [MunicipalityModel],
    description: 'Gets municipalities',
  })
  async getAllMunicipalities(): Promise<MunicipalityModel[]> {
    return await this.municipalityService.getAll()
  }

  @Put('')
  @UseGuards(StaffGuard)
  @StaffRolesRules(StaffRole.ADMIN)
  @ApiOkResponse({
    type: MunicipalityModel,
    description: 'Updates municipality',
  })
  async updateMunicipality(
    @CurrentStaff() staff: Staff,
    @Body() input: UpdateMunicipalityDto,
  ): Promise<MunicipalityModel> {
    return await this.municipalityService.updateMunicipality(
      staff.municipalityId,
      input,
    )
  }
}
