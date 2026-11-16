import { Sequelize } from 'sequelize-typescript'

import { Controller, Inject, Param, Post, UseGuards } from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  CurrentHttpUser,
  JwtAuthUserGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'
import { type User } from '@island.is/judicial-system/types'

import { defenderRule } from '../../guards'
import { getOrCreateTransaction } from '../../middleware'
import { CurrentCase } from '../case/guards/case.decorator'
import { CaseCompletedGuard } from '../case/guards/caseCompleted.guard'
import { CaseTypeGuard } from '../case/guards/caseType.guard'
import { CaseWriteGuard } from '../case/guards/caseWrite.guard'
import { LimitedAccessCaseExistsForUpdateGuard } from '../case/guards/limitedAccessCaseExistsForUpdate.guard'
import { CurrentDefendant } from '../defendant/guards/defendant.decorator'
import { DefendantExistsGuard } from '../defendant/guards/defendantExists.guard'
import { Case, Defendant, Verdict } from '../repository'
import { CurrentVerdict } from './guards/verdict.decorator'
import { VerdictExistsGuard } from './guards/verdictExists.guard'
import { VerdictService } from './verdict.service'

// RolesGuard sits at class level, ahead of the locking read, as it does on
// VerdictController: the one rule here is a bare user role that reads nothing
// off the request, so a caller who is not a defender is turned away before any
// case row is locked. limitedAccessVerdictGuardChain.spec.ts runs the chain.
@Controller('api/case/:caseId/limitedAccess')
@ApiTags('limited access verdicts')
@UseGuards(JwtAuthUserGuard, RolesGuard)
export class LimitedAccessVerdictController {
  constructor(
    private readonly verdictService: VerdictService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(
    LimitedAccessCaseExistsForUpdateGuard,
    new CaseTypeGuard(indictmentCases),
    CaseWriteGuard,
    DefendantExistsGuard,
    VerdictExistsGuard,
    CaseCompletedGuard,
  )
  @RolesRules(defenderRule)
  @Post('defendant/:defendantId/verdict/accept')
  @ApiOkResponse({
    type: Verdict,
    description:
      "Registers that the defendant accepts the verdict, on the defender's word",
  })
  async acceptVerdict(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @CurrentVerdict() verdict: Verdict,
  ): Promise<Verdict> {
    this.logger.debug(
      `Accepting verdict ${verdict.id} of ${defendantId} in ${caseId}`,
    )

    // The same transaction the guard read the case in - opening one of our own
    // would block on its row lock.
    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.verdictService.acceptVerdictAsDefender(
      theCase,
      defendant,
      verdict,
      user,
      transaction,
    )
  }
}
