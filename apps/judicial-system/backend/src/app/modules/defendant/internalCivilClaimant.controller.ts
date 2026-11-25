import { Sequelize } from 'sequelize-typescript'

import {
  Body,
  Controller,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { TokenGuard } from '@island.is/judicial-system/auth'
import {
  messageEndpoint,
  MessageType,
} from '@island.is/judicial-system/message'
import { indictmentCases } from '@island.is/judicial-system/types'

import { getOrCreateTransaction } from '../../middleware'
import {
  CaseExistsForUpdateGuard,
  CaseExistsGuard,
  CaseTypeGuard,
  CurrentCase,
} from '../case'
import { Case, CivilClaimant } from '../repository'
import { DeliverDto } from './dto/deliver.dto'
import { InternalUpdateCivilClaimantDto } from './dto/internalUpdateCivilClaimant.dto'
import { CurrentCivilClaimant } from './guards/civilClaimaint.decorator'
import { CivilClaimantExistsGuard } from './guards/civilClaimantExists.guard'
import { CivilClaimantNationalIdExistsGuard } from './guards/civilClaimantNationalIdExists.guard'
import { DeliverResponse } from './models/deliver.response'
import { CivilClaimantService } from './civilClaimant.service'

@Controller('api/internal/case/:caseId')
@ApiTags('internal civil claimants')
@UseGuards(TokenGuard)
export class InternalCivilClaimantController {
  constructor(
    private readonly civilClaimantService: CivilClaimantService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(
    CaseExistsForUpdateGuard,
    new CaseTypeGuard(indictmentCases),
    CivilClaimantNationalIdExistsGuard,
  )
  @Patch('civil-claimant-counsel/:civilClaimantNationalId')
  @ApiOkResponse({
    type: CivilClaimant,
    description:
      'Updates civil claimant appeal spokesperson choice by case and national id',
  })
  async updateCivilClaimantCounsel(
    @Param('caseId') caseId: string,
    @Param('civilClaimantNationalId') _: string,
    @CurrentCase() theCase: Case,
    @CurrentCivilClaimant() civilClaimant: CivilClaimant,
    @Body() update: InternalUpdateCivilClaimantDto,
  ): Promise<CivilClaimant> {
    this.logger.debug(`Updating civil claimant counsel info for case ${caseId}`)

    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.civilClaimantService.updateRestricted(
      theCase,
      civilClaimant,
      update,
      transaction,
    )
  }

  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    CivilClaimantExistsGuard,
  )
  @Post(
    `${
      messageEndpoint[MessageType.DELIVERY_TO_COURT_INDICTMENT_CIVIL_CLAIMANT]
    }/:civilClaimantId`,
  )
  @ApiOkResponse({
    type: DeliverResponse,
    description: 'Delivers indictment case civil claimant info to court',
  })
  deliverIndictmentCivilClaimantToCourt(
    @Param('caseId') caseId: string,
    @Param('civilClaimantId') civilClaimantId: string,
    @CurrentCase() theCase: Case,
    @CurrentCivilClaimant() civilClaimant: CivilClaimant,
    @Body() deliverDto: DeliverDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Delivering civil claimant info for civil claimant ${civilClaimantId} of case ${caseId} to court`,
    )

    return this.civilClaimantService.deliverIndictmentCivilClaimantToCourt(
      theCase,
      civilClaimant,
      deliverDto.user,
    )
  }
}
