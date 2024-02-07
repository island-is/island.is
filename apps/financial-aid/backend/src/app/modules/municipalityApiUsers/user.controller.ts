import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
  Delete,
} from '@nestjs/common'

import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { StaffRole, apiBasePath } from '@island.is/financial-aid/shared/lib'
import type { Staff } from '@island.is/financial-aid/shared/lib'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ApiUserService } from './user.service'
import { ApiUserModel } from './models/user.model'
import { CurrentStaff } from '../../decorators/staff.decorator'
import { StaffGuard } from '../../guards/staff.guard'
import { StaffRolesRules } from '../../decorators/staffRole.decorator'
import { MunicipalitiesFinancialAidScope } from '@island.is/auth/scopes'
import { CreateApiKeyDto } from './dto'
import { DeleteApiKeyResponse } from './models/deleteFile.response'

@UseGuards(IdsUserGuard, ScopesGuard, StaffGuard)
@Controller(`${apiBasePath}/apiKeys`)
@ApiTags('apiKeys')
export class ApiUserController {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly apiUserService: ApiUserService,
  ) {}

  @StaffRolesRules(StaffRole.ADMIN)
  @Scopes(MunicipalitiesFinancialAidScope.employee)
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

  @StaffRolesRules(StaffRole.ADMIN)
  @Scopes(MunicipalitiesFinancialAidScope.write)
  @Put('/:id')
  @ApiOkResponse({
    type: ApiUserModel,
    description: 'Updates an existing api key',
  })
  async update(
    @Param('id') id: string,
    @Body()
    input: {
      name: string
    },
  ): Promise<ApiUserModel> {
    this.logger.debug(`Api key controller: Updating api key with id ${id}`)
    return this.apiUserService.updateApiKey(id, input.name)
  }

  @StaffRolesRules(StaffRole.ADMIN)
  @Scopes(MunicipalitiesFinancialAidScope.write)
  @Delete('/:id')
  @ApiOkResponse({
    type: DeleteApiKeyResponse,
    description: 'Deletes an existing api key',
  })
  async delete(@Param('id') id: string): Promise<DeleteApiKeyResponse> {
    this.logger.debug(`Api key controller: delete api key with id ${id}`)
    return this.apiUserService.delete(id)
  }
}
