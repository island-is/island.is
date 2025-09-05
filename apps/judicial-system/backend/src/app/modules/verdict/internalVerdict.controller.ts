import {
  BadRequestException,
  Body,
  Controller,
  Get,
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
  CaseCompletedGuard,
  CaseExistsGuard,
  CaseTypeGuard,
  CurrentCase,
} from '../case'
import { CurrentDefendant, DefendantExistsGuard } from '../defendant'
import { DefendantNationalIdExistsGuard } from '../defendant/guards/defendantNationalIdExists.guard'
import { Case, Defendant, Verdict } from '../repository'
import { VerdictService } from '../verdict/verdict.service'
import { DeliverDto } from './dto/deliver.dto'
import { InternalUpdateVerdictDto } from './dto/internalUpdateVerdict.dto'
import { PoliceUpdateVerdictDto } from './dto/policeUpdateVerdict.dto'
import { ExternalPoliceVerdictExistsGuard } from './guards/ExternalPoliceVerdictExists.guard'
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

@Controller('api/internal')
@ApiTags('internal verdict')
@UseGuards(TokenGuard)
export class InternalVerdictController {
  constructor(
    private readonly verdictService: VerdictService,
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    CaseCompletedGuard,
    DefendantExistsGuard,
    VerdictExistsGuard,
  )
  @Post([
    `case/:caseId/${
      messageEndpoint[
        MessageType.DELIVER_TO_NATIONAL_COMMISSIONERS_OFFICE_VERDICT
      ]
    }/:defendantId`,
  ])
  @ApiOkResponse({
    type: DeliverResponse,
    description: 'Delivers a verdict to the police centralized file service',
  })
  deliverVerdictToNationalCommissionersOffice(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @CurrentVerdict() verdict: Verdict,
    @Body() deliverDto: DeliverDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Delivering verdict ${verdict.id} pdf to the police centralized file service for defendant ${defendantId} of case ${caseId}`,
    )
    if (defendant.noNationalId) {
      throw new BadRequestException(
        `National id is required for ${defendant.id} when delivering verdict to national commissioners office`,
      )
    }

    // callback function to fetch the updated verdict fields after delivering verdict to police
    const getDeliveredVerdictNationalCommissionersOfficeLogDetails = async (
      results: DeliverResponse,
    ) => {
      const currentVerdict = await this.verdictService.findById(verdict.id)
      return {
        deliveredToPolice: results.delivered,
        verdictId: verdict.id,
        verdictCreated: verdict.created,
        externalPoliceDocumentId: currentVerdict.externalPoliceDocumentId,
        subpoenaHash: currentVerdict.hash,
        verdictDeliveredToPolice: new Date(),
        indictmentHash: theCase.indictmentHash,
      }
    }
    return this.auditTrailService.audit(
      deliverDto.user.id,
      AuditedAction.DELIVER_TO_NATIONAL_COMMISSIONERS_OFFICE_VERDICT,
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

  @UseGuards(ExternalPoliceVerdictExistsGuard)
  @Patch('verdict/:policeDocumentId')
  async updateVerdict(
    @Param('policeDocumentId') policeDocumentId: string,
    @CurrentVerdict() verdict: Verdict,
    @Body() update: PoliceUpdateVerdictDto,
  ): Promise<Verdict> {
    this.logger.debug(
      `Updating verdict by external police document id ${policeDocumentId}`,
    )
    return await this.verdictService.updatePoliceDelivery(verdict, update)
  }

  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    CaseCompletedGuard,
    DefendantNationalIdExistsGuard,
    VerdictExistsGuard,
  )
  @Patch('/case/:caseId/defendant/:defendantNationalId/verdict-appeal')
  @ApiOkResponse({
    type: Verdict,
    description: 'Updates defendant verdict appeal decision',
  })
  updateVerdictAppeal(
    @Param('caseId') caseId: string,
    @Param('defendantNationalId') _: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @CurrentVerdict() verdict: Verdict,
    @Body() verdictAppeal: InternalUpdateVerdictDto,
  ): Promise<Verdict> {
    this.logger.debug(
      `Updating verdict appeal for defendant ${defendant.id} in case ${caseId}`,
    )

    validateVerdictAppealUpdate({
      caseId: theCase.id,
      indictmentRulingDecision: theCase.indictmentRulingDecision,
      rulingDate: theCase.rulingDate,
      verdict,
    })

    const updatedVerdict = this.verdictService.updateRestricted(verdict, {
      appealDecision: verdictAppeal.appealDecision,
    })
    return updatedVerdict
  }

  @UseGuards(ExternalPoliceVerdictExistsGuard)
  @Get('verdict/:policeDocumentId')
  async getVerdictSupplements(
    @Param('policeDocumentId') policeDocumentId: string,
  ): Promise<Pick<Verdict, 'serviceInformationForDefendant'>> {
    this.logger.debug(
      `Get verdict supplements for police document id ${policeDocumentId}`,
    )
    const verdict = await this.verdictService.findByExternalPoliceDocumentId(
      policeDocumentId,
    )
    return {
      serviceInformationForDefendant: verdict.serviceInformationForDefendant,
    }
  }
}
