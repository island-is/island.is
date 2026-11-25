import { Sequelize } from 'sequelize-typescript'

import {
  Body,
  Controller,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  CurrentHttpUser,
  JwtAuthUserGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import { indictmentCases, type User } from '@island.is/judicial-system/types'

import {
  courtOfAppealsAssistantRule,
  courtOfAppealsJudgeRule,
  courtOfAppealsRegistrarRule,
} from '../../guards'
import { getOrCreateTransaction } from '../../middleware'
import { CurrentAppealCase } from '../appeal-case/guards/appealCase.decorator'
import { AppealCaseExistsGuard } from '../appeal-case/guards/appealCaseExists.guard'
import {
  CaseExistsForUpdateGuard,
  CaseTypeGuard,
  CaseWriteGuard,
  CurrentCase,
} from '../case'
import { AppealCase, AppealStatementDeadline, Case } from '../repository'
import { SetAppealStatementDeadlineDto } from './dto/setAppealStatementDeadline.dto'
import { AppealStatementDeadlineService } from './appealStatementDeadline.service'

// The route changes a verdict appeal, and the same two rules the court
// session routes follow apply, for the same reasons. CaseExistsForUpdateGuard
// reads the case under FOR UPDATE in the request's transaction, so the
// handler joins that transaction rather than open one of its own, which would
// block on the guard's row lock: a deadlock, not a race. And RolesGuard runs
// ahead of the locking guard, which is only safe while every rule here is a
// bare user role with no canActivate reading request.case;
// appealStatementDeadlineRolesRules.spec.ts pins that.
@Controller('api/case/:caseId/appealCase/:appealCaseId/statementDeadline')
@ApiTags('appeal statement deadlines')
@UseGuards(
  JwtAuthUserGuard,
  RolesGuard,
  CaseExistsForUpdateGuard,
  new CaseTypeGuard(indictmentCases),
  AppealCaseExistsGuard,
  CaseWriteGuard,
)
export class AppealStatementDeadlineController {
  constructor(
    private readonly appealStatementDeadlineService: AppealStatementDeadlineService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @RolesRules(
    courtOfAppealsJudgeRule,
    courtOfAppealsRegistrarRule,
    courtOfAppealsAssistantRule,
  )
  @Post()
  @ApiCreatedResponse({
    type: AppealStatementDeadline,
    description:
      'Gives a party of a verdict appeal a deadline to file its statement, or extends the one it has',
  })
  async set(
    @Param('caseId') caseId: string,
    @Param('appealCaseId') appealCaseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @CurrentAppealCase() appealCase: AppealCase,
    @Body() dto: SetAppealStatementDeadlineDto,
  ): Promise<AppealStatementDeadline> {
    this.logger.debug(
      `Setting a statement deadline in appeal case ${appealCaseId} of case ${caseId}`,
    )

    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.appealStatementDeadlineService.set(
      theCase,
      appealCase,
      user,
      dto,
      transaction,
    )
  }
}
