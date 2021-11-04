import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'

import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { StaffService } from './staff.service'
import { StaffModel } from './models'
import {
  apiBasePath,
  RolesRule,
  StaffRole,
} from '@island.is/financial-aid/shared/lib'

import type { Staff } from '@island.is/financial-aid/shared/lib'
import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { RolesGuard } from '../../guards/roles.guard'
import { CurrentStaff, RolesRules } from '../../decorators'
import { StaffGuard } from '../../guards/staff.guard'
import { StaffRolesRules } from '../../decorators/staffRole.decorator'
import { CreateStaffDto } from './dto'

@UseGuards(IdsUserGuard, RolesGuard)
@RolesRules(RolesRule.VEITA)
@Controller(`${apiBasePath}/staff`)
@ApiTags('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get('nationalId/:nationalId')
  @ApiOkResponse({
    type: StaffModel,
    description: 'Gets staff by nationalId',
  })
  async getStaffByNationalId(
    @Param('nationalId') nationalId: string,
  ): Promise<StaffModel> {
    const staff = await this.staffService.findByNationalId(nationalId)
    if (staff === null || staff.active === false) {
      throw new ForbiddenException('Staff not found or is not active')
    }
    return staff
  }

  @UseGuards(StaffGuard)
  @StaffRolesRules(StaffRole.ADMIN)
  @Get('municipality')
  @ApiOkResponse({
    type: [StaffModel],
    description: 'Gets staff for municipality',
  })
  async getStaffForMunicipality(
    @CurrentStaff() staff: Staff,
  ): Promise<StaffModel[]> {
    return await this.staffService.findByMunicipalityId(staff.municipalityId)
  }

  @UseGuards(StaffGuard)
  @StaffRolesRules(StaffRole.ADMIN)
  @Post('')
  @ApiOkResponse({
    type: StaffModel,
    description: 'Creates staff',
  })
  async createStaff(
    @CurrentStaff() staff: Staff,
    @Body() createStaffInput: CreateStaffDto,
  ): Promise<StaffModel> {
    return await this.staffService.createStaff(staff, createStaffInput)
  }
}
