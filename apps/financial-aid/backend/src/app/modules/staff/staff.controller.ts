import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'

import { ApiOkResponse, ApiTags, ApiCreatedResponse } from '@nestjs/swagger'

import { StaffService } from './staff.service'
import { StaffModel } from './models'

import { RolesRule, Staff } from '@island.is/financial-aid/shared/lib'

import {
  JwtAuthGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/financial-aid/auth'

@Controller('api')
@ApiTags('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get('staff/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(RolesRule.VEITA)
  @ApiOkResponse({
    type: StaffModel,
    description: 'Gets staff by id',
  })
  async getById(@Param('id') id: string): Promise<Staff> {
    const staff = await this.staffService.findById(id)

    if (!staff) {
      throw new NotFoundException(`Staff with id ${id} not found`)
    }

    return staff
  }
}
