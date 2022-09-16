import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common'
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
import { DirectTaxPaymentsResponse, PersonalTaxReturnResponse } from './models/'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(
  MunicipalitiesFinancialAidScope.read,
  MunicipalitiesFinancialAidScope.applicant,
)
@Controller(`${apiBasePath}/personalTaxReturn`)
@ApiTags('personalTaxReturn')
export class PersonalTaxReturnController {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
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
    this.logger.debug(
      'PersonalTaxReturn controller: Getting personal tax return',
    )
    try {
      return await this.personalTaxReturnService.personalTaxReturn(
        user.nationalId,
        id,
      )
    } catch (e) {
      this.logger.error(
        'PersonalTaxReturn controller: Failed getting personal tax return',
        e,
      )
      throw e
    }
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
    @CurrentUser() user: User,
  ): Promise<DirectTaxPaymentsResponse> {
    this.logger.debug(
      'PersonalTaxReturn controller: Getting direct tax payments',
    )
    try {
      return await this.personalTaxReturnService.directTaxPayments(
        user.nationalId,
      )
    } catch (e) {
      this.logger.error(
        'PersonalTaxReturn controller: Failed direct tax payments',
        e,
      )
      throw e
    }
  }
}
