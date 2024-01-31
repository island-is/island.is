import { Controller, Get, Inject, UseGuards } from '@nestjs/common'

import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { apiBasePath } from '@island.is/financial-aid/shared/lib'
import type { Staff } from '@island.is/financial-aid/shared/lib'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ApiUserService } from './user.service'
import { ApiUserModel } from './user.model'
import { CurrentStaff } from '../../decorators/staff.decorator'
import { StaffGuard } from '../../guards/staff.guard'

@UseGuards(IdsUserGuard, ScopesGuard, StaffGuard)
@Controller(`${apiBasePath}/apiKeys`)
@ApiTags('apiKeys')
export class ApiUserController {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly apiUserService: ApiUserService,
  ) {}

  @Get('')
  @ApiOkResponse({
    type: [ApiUserModel],
    description: 'Gets api info by municipality codes',
  })
  async getApiKeysByMunicipalityCodes(
    @CurrentStaff() staff: Staff,
  ): Promise<ApiUserModel[]> {
    return this.apiUserService.findByMunicipalityCode(staff.municipalityIds)
  }
}
