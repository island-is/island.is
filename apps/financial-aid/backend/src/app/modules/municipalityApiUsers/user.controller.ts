import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common'

import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { StaffRole, apiBasePath } from '@island.is/financial-aid/shared/lib'
import type { Staff } from '@island.is/financial-aid/shared/lib'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ApiUserService } from './user.service'
import { ApiUserModel } from './user.model'
import { CurrentStaff } from '../../decorators/staff.decorator'
import { StaffGuard } from '../../guards/staff.guard'
import { StaffRolesRules } from '../../decorators/staffRole.decorator'
import { MunicipalitiesFinancialAidScope } from '@island.is/auth/scopes'
import { CreateApiKeyDto } from './dto'

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

  @UseGuards(StaffGuard)
  @StaffRolesRules(StaffRole.ADMIN)
  @Scopes(MunicipalitiesFinancialAidScope.employee)
  @Post('')
  @ApiCreatedResponse({
    type: ApiUserModel,
    description: 'Creates a new api key',
  })
  create(@Body() input: CreateApiKeyDto): Promise<ApiUserModel> {
    return this.apiUserService.create(input)
  }
}
