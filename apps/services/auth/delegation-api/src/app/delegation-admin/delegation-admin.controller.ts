import { Controller, Get, Headers, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'
import {
  DelegationAdminCustomDto,
  DelegationAdminCustomService,
} from '@island.is/auth-api-lib'
import { Documentation } from '@island.is/nest/swagger'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('delegation-admin')
@Controller('delegation-admin')
export class DelegationAdminController {
  constructor(
    private readonly delegationAdminService: DelegationAdminCustomService,
  ) {}

  @Get()
  @Documentation({
    response: { status: 200, type: DelegationAdminCustomDto },
    request: {
      header: {
        'X-Query-National-Id': {
          required: true,
          description: 'fetch delegations for this national id',
        },
      },
    },
  })
  async getDelegationAdmin(
    @Headers('X-Query-National-Id') nationalId: string,
  ): Promise<DelegationAdminCustomDto> {
    return await this.delegationAdminService.getAllDelegationsByNationalId(
      nationalId,
    )
  }
}
