import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { apiBasePath } from '@island.is/financial-aid/shared/lib'

import type { User } from '@island.is/financial-aid/shared/lib'

import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { MunicipalitiesFinancialAidScope } from '@island.is/auth/scopes'
import { PersonalTaxReturnService } from './personalTaxReturn.service'
import { PersonalTaxReturnResponse } from './models/personalTaxReturn.response'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(
  MunicipalitiesFinancialAidScope.read,
  MunicipalitiesFinancialAidScope.applicant,
)
@Controller(`${apiBasePath}/personalTaxReturn`)
@ApiTags('personalTaxReturn')
export class PersonalTaxReturnController {
  constructor(
    private readonly personalTaxReturnService: PersonalTaxReturnService,
  ) {}

  @Get('')
  @ApiOkResponse({
    type: PersonalTaxReturnResponse,
    description: 'Fetches personal tax return and uploads it to s3',
  })
  async municipalitiesPersonalTaxReturn(
    @CurrentUser() user: User,
  ): Promise<PersonalTaxReturnResponse> {
    // TODO: Get application id as query parameter input
    return await this.personalTaxReturnService.personalTaxReturn(
      user.nationalId,
      'todo',
    )
  }
}
