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
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'
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
  ServiceRequirement,
} from '@island.is/judicial-system/types'

import {
  Case,
  CaseCompletedGuard,
  CaseExistsGuard,
  CaseTypeGuard,
  CurrentCase,
} from '../case'
import { CurrentDefendant, Defendant, DefendantExistsGuard } from '../defendant'
import { DefendantNationalIdExistsGuard } from '../defendant/guards/defendantNationalIdExists.guard'
import { Verdict } from '../verdict/models/verdict.model'
import { VerdictService } from '../verdict/verdict.service'
import { DeliverDto } from './dto/deliver.dto'
import { UpdateVerdictAppealDto } from './dto/updateVerdictAppeal.dto'
import { CurrentVerdict } from './guards/verdict.decorator'
import { VerdictExistsGuard } from './guards/verdictExists.guard'
import { DeliverResponse } from './models/deliver.response'

const validateVerdictAppealUpdate = ({
  caseId,
  indictmentRulingDecision,
  rulingDate,
  verdict,
}: {
  caseId: string
  indictmentRulingDecision?: CaseIndictmentRulingDecision
  rulingDate?: Date
  verdict: Verdict
}) => {
  if (!rulingDate) {
    throw new BadRequestException(
      `Cannot register appeal – No ruling date has been set for case ${caseId}`,
    )
  }
  const isServiceRequired =
    verdict.serviceRequirement === ServiceRequirement.REQUIRED
  const isFine = indictmentRulingDecision === CaseIndictmentRulingDecision.FINE
  const baseDate = isServiceRequired ? verdict.serviceDate : rulingDate

  // this can only be thrown if service date is not set
  if (!baseDate) {
    throw new BadRequestException(
      `Cannot register appeal – Service date not set for case ${caseId}`,
    )
  }
  const appealDeadline = getIndictmentAppealDeadlineDate(
    new Date(baseDate),
    isFine,
  )
  if (hasDatePassed(appealDeadline)) {
    throw new BadRequestException(
      `Appeal deadline has passed for case ${caseId}. Deadline was ${appealDeadline.toISOString()}`,
    )
  }
}

@Controller('api/internal/case/:caseId')
@ApiTags('internal verdict')
@UseGuards(TokenGuard, CaseExistsGuard)
export class InternalVerdictController {
  constructor(
    private readonly verdictService: VerdictService,
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(
    new CaseTypeGuard(indictmentCases),
    DefendantExistsGuard,
    VerdictExistsGuard,
  )
  @Post([
    `case/:caseId/${
      messageEndpoint[
        MessageType.DELIVER_VERDICT_TO_NATIONAL_COMMISSIONERS_OFFICE
      ]
    }/:defendantId/:verdictId`,
  ])
  @ApiOkResponse({
    type: DeliverResponse,
    description: 'Delivers a verdict to the police centralized file service',
  })
  deliverVerdictToNationalCommissionersOffice(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @Param('verdictId') verdictId: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @CurrentVerdict() verdict: Verdict,
    @Body() deliverDto: DeliverDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Delivering verdict ${verdictId} pdf to the police centralized file service for defendant ${defendantId} of case ${caseId}`,
    )

    // callback function to fetch the updated verdict fields after delivering verdict to police
    const getDeliveredVerdictNationalCommissionersOfficeLogDetails = async (
      results: DeliverResponse,
    ) => {
      const currentVerdict = await this.verdictService.findById(verdictId)
      return {
        deliveredToPolice: results.delivered,
        verdictId: verdictId,
        verdictCreated: verdict.created,
        externalPoliceDocumentId: currentVerdict.externalPoliceDocumentId,
        subpoenaHash: currentVerdict.hash,
        verdictDeliveredToPolice: new Date(),
        indictmentHash: theCase.indictmentHash,
      }
    }

    return this.auditTrailService.audit(
      deliverDto.user.id,
      AuditedAction.DELIVER_VERDICT_TO_NATIONAL_COMMISSIONERS_OFFICE,
      this.verdictService.deliverVerdictToNationalCommissionersOffice(
        theCase,
        defendant,
        verdict,
        deliverDto.user,
      ),
      caseId,
      getDeliveredVerdictNationalCommissionersOfficeLogDetails,
    )
  }

  @UseGuards(
    new CaseTypeGuard(indictmentCases),
    CaseCompletedGuard,
    DefendantNationalIdExistsGuard,
  )
  @Patch('defendant/:defendantNationalId/verdict-appeal')
  @ApiOkResponse({
    type: Verdict,
    description: 'Updates defendant verdict appeal decision',
  })
  updateVerdictAppeal(
    @Param('caseId') caseId: string,
    @Param('defendantNationalId') _: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @Body() verdictAppeal: UpdateVerdictAppealDto,
  ): Promise<Verdict> {
    this.logger.debug(`Updating verdict appeal for defendant in case ${caseId}`)

    const { verdict } = defendant
    if (!verdict) {
      throw new BadRequestException(
        `Cannot register appeal – No verdict has been issued for case ${caseId}`,
      )
    }

    validateVerdictAppealUpdate({
      caseId: theCase.id,
      indictmentRulingDecision: theCase.indictmentRulingDecision,
      rulingDate: theCase.rulingDate,
      verdict,
    })

    const updatedVerdict = this.verdictService.updateRestricted(verdict, {
      appealDecision: verdictAppeal.verdictAppealDecision,
    })
    return updatedVerdict
  }
}
