import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { TokenGuard } from '@island.is/judicial-system/auth'
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
import { CurrentDefendant, Defendant } from '../defendant'
import { DefendantNationalIdExistsGuard } from '../defendant/guards/defendantNationalIdExists.guard'
import { Verdict } from '../verdict/models/verdict.model'
import { VerdictService } from '../verdict/verdict.service'
import { InternalUpdateVerdictDto } from './dto/internalUpdateVerdict.dto'
import { CurrentVerdict } from './guards/verdict.decorator'
import { VerdictExistGuard } from './guards/verdictExistGuard.guard'

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
@UseGuards(
  TokenGuard,
  CaseExistsGuard,
  new CaseTypeGuard(indictmentCases),
  CaseCompletedGuard,
  DefendantNationalIdExistsGuard,
  VerdictExistGuard,
)
export class InternalVerdictController {
  constructor(
    private readonly verdictService: VerdictService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}
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
}
