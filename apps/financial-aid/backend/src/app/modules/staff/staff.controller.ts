import { Controller, Get, Param, UseGuards } from '@nestjs/common'

import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { StaffService } from './staff.service'
import { StaffModel } from './models'
import { TokenGuard } from '@island.is/financial-aid/auth'

@Controller('api/staff')
@ApiTags('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @UseGuards(TokenGuard)
  @Get(':nationalId')
  @ApiOkResponse({
    type: StaffModel,
    description: 'Gets staff by nationalId',
  })
  async getStaffByNationalId(@Param('nationalId') nationalId: string) {
    return await this.staffService.findByNationalId(nationalId)
  }
}
