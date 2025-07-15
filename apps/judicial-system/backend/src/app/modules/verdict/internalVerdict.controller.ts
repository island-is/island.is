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
import { UpdateVerdictAppealDto } from './dto/updateVerdictAppeal.dto'

@Controller('api/internal/case/:caseId')
@ApiTags('internal defendants')
@UseGuards(TokenGuard, CaseExistsGuard)
export class InternalDefendantController {
  constructor(
    private readonly verdictService: VerdictService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

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
    if (!verdict || !theCase.rulingDate) {
      throw new BadRequestException(
        `No verdict has been issued for case ${theCase.id}`,
      )
    }
    // Validate appeal deadline
    const isServiceRequired =
      verdict.serviceRequirement === ServiceRequirement.REQUIRED
    const isFine =
      theCase.indictmentRulingDecision === CaseIndictmentRulingDecision.FINE
    const baseDate = isServiceRequired
      ? verdict.serviceDate
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

    const updatedVerdict = this.verdictService.updateRestricted(verdict, {
      appealDecision: verdictAppeal.verdictAppealDecision,
    })
    return updatedVerdict
  }
}
