import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { TokenGuard } from '@island.is/judicial-system/auth'
import {
  messageEndpoint,
  MessageType,
} from '@island.is/judicial-system/message'
import {
  CaseIndictmentRulingDecision,
  getIndictmentAppealDeadlineDate,
  hasDatePassed,
  indictmentCases,
  investigationCases,
  restrictionCases,
  ServiceRequirement,
} from '@island.is/judicial-system/types'

import {
  Case,
  CaseCompletedGuard,
  CaseExistsGuard,
  CaseTypeGuard,
  CurrentCase,
} from '../case'
import { DeliverDto } from './dto/deliver.dto'
import { InternalUpdateDefendantDto } from './dto/internalUpdateDefendant.dto'
import { UpdateVerdictAppealDto } from './dto/updateVerdictAppeal.dto'
import { CurrentDefendant } from './guards/defendant.decorator'
import { DefendantExistsGuard } from './guards/defendantExists.guard'
import { DefendantNationalIdExistsGuard } from './guards/defendantNationalIdExists.guard'
import { Defendant } from './models/defendant.model'
import { DeliverResponse } from './models/deliver.response'
import { DefendantService } from './defendant.service'

@Controller('api/internal/case/:caseId')
@ApiTags('internal defendants')
@UseGuards(TokenGuard, CaseExistsGuard)
export class InternalDefendantController {
  constructor(
    private readonly defendantService: DefendantService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    DefendantExistsGuard,
  )
  @Post(
    `${messageEndpoint[MessageType.DELIVERY_TO_COURT_DEFENDANT]}/:defendantId`,
  )
  @ApiCreatedResponse({
    type: DeliverResponse,
    description: 'Delivers a case file to court',
  })
  deliverDefendantToCourt(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @Body() deliverDefendantToCourtDto: DeliverDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Delivering defendant ${defendantId} of case ${caseId} to court`,
    )

    return this.defendantService.deliverDefendantToCourt(
      theCase,
      defendant,
      deliverDefendantToCourtDto.user,
    )
  }

  @UseGuards(new CaseTypeGuard(indictmentCases), DefendantNationalIdExistsGuard)
  @Patch('defense/:defendantNationalId')
  @ApiOkResponse({
    type: Defendant,
    description: 'Updates defendant information by case and national id',
  })
  updateDefendant(
    @Param('caseId') caseId: string,
    @Param('defendantNationalId') _: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @Body() updatedDefendantChoice: InternalUpdateDefendantDto,
  ): Promise<Defendant> {
    this.logger.debug(`Updating defendant info for ${caseId}`)

    return this.defendantService.updateRestricted(
      theCase,
      defendant,
      updatedDefendantChoice,
    )
  }

  @UseGuards(
    new CaseTypeGuard(indictmentCases),
    CaseCompletedGuard,
    DefendantNationalIdExistsGuard,
  )
  @Patch('defendant/:defendantNationalId/verdict-appeal')
  @ApiOkResponse({
    type: Defendant,
    description: 'Updates defendant verdict appeal decision',
  })
  updateVerdictAppeal(
    @Param('caseId') caseId: string,
    @Param('defendantNationalId') _: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @Body() verdictAppeal: UpdateVerdictAppealDto,
  ): Promise<Defendant> {
    this.logger.debug(`Updating verdict appeal for defendant in case ${caseId}`)

    if (!theCase.rulingDate) {
      throw new BadRequestException(
        `No verdict has been issued for case ${theCase.id}`,
      )
    }
    // Validate appeal deadline
    const serviceRequired =
      defendant.serviceRequirement === ServiceRequirement.REQUIRED
    const isFine =
      theCase.indictmentRulingDecision === CaseIndictmentRulingDecision.FINE
    const baseDate = serviceRequired
      ? defendant.verdictViewDate
      : theCase.rulingDate

    if (!baseDate) {
      throw new BadRequestException(
        `Cannot register appeal – ruling date not available for case ${theCase.id}`,
      )
    }

    const appealDeadline = getIndictmentAppealDeadlineDate(
      new Date(baseDate),
      isFine,
    )
    if (hasDatePassed(appealDeadline)) {
      throw new BadRequestException(
        `Appeal deadline has passed for case ${
          theCase.id
        }. Deadline was ${appealDeadline.toISOString()}`,
      )
    }

    return this.defendantService.updateRestricted(
      theCase,
      defendant,
      verdictAppeal,
    )
  }

  @UseGuards(new CaseTypeGuard(indictmentCases), DefendantExistsGuard)
  @Post(
    `${
      messageEndpoint[MessageType.DELIVERY_TO_COURT_INDICTMENT_DEFENDER]
    }/:defendantId`,
  )
  @ApiOkResponse({
    type: DeliverResponse,
    description: 'Delivers indictment case defender info to court',
  })
  deliverIndictmentDefenderToCourt(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @Body() deliverDto: DeliverDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Delivering defender info for defendant ${defendantId} of case ${caseId} to court`,
    )

    return this.defendantService.deliverIndictmentDefenderToCourt(
      theCase,
      defendant,
      deliverDto.user,
    )
  }
}
