import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'

import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

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

  @Get('staff/:nationalId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(RolesRule.VEITA)
  @ApiOkResponse({
    type: StaffModel,
    description: 'Gets staff by nationalId',
  })
  async getByNationalId(
    @Param('nationalId') nationalId: string,
  ): Promise<Staff> {
    const staff = await this.staffService.findByNationalId(nationalId)

    if (!staff) {
      throw new NotFoundException(
        `Staff with nationalId ${nationalId} not found`,
      )
    }

    return staff
  }
}
