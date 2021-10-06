import {
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'

import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { StaffService } from './staff.service'
import { StaffModel } from './models'
import { apiBasePath, RolesRule } from '@island.is/financial-aid/shared/lib'
import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { RolesGuard } from '../../guards'
import { RolesRules } from '../../decorators'

@UseGuards(IdsUserGuard, RolesGuard)
@RolesRules(RolesRule.VEITA)
@Controller(`${apiBasePath}/staff`)
@ApiTags('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get(':nationalId')
  @ApiOkResponse({
    type: StaffModel,
    description: 'Gets staff by nationalId',
  })
  async getStaffByNationalId(
    @Param('nationalId') nationalId: string,
  ): Promise<StaffModel> {
    const staff = await this.staffService.findByNationalId(nationalId)
    if (staff === null) {
      throw new ForbiddenException('Staff not found')
    }
    return staff
  }
}
