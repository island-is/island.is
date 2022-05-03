import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { apiBasePath, UserType } from '@island.is/financial-aid/shared/lib'

import type { User } from '@island.is/financial-aid/shared/lib'

import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { MunicipalitiesFinancialAidScope } from '@island.is/auth/scopes'
import { PersonalTaxReturnService } from './personalTaxReturn.service'
import { DirectTaxPaymentsResponse, PersonalTaxReturnResponse } from './models/'

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

  @Get('id/:id')
  @ApiOkResponse({
    type: PersonalTaxReturnResponse,
    description: 'Fetches personal tax return and uploads it to s3.',
  })
  async municipalitiesPersonalTaxReturn(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<PersonalTaxReturnResponse> {
    return await this.personalTaxReturnService.personalTaxReturn(
      user.nationalId,
      id,
    )
  }

  @Get('directTaxPayments')
  @UseGuards(IdsUserGuard, ScopesGuard)
  @Scopes(
    MunicipalitiesFinancialAidScope.read,
    MunicipalitiesFinancialAidScope.applicant,
  )
  @ApiOkResponse({
    type: DirectTaxPaymentsResponse,
    description: 'Fetches direct tax payments for last three months from user.',
  })
  async municipalitiesDirectTaxPayments(
    @Query('userType') userType: UserType,
    @CurrentUser() user: User,
  ): Promise<DirectTaxPaymentsResponse> {
    return await this.personalTaxReturnService.directTaxPayments(
      user.nationalId,
      userType,
    )
  }
}
