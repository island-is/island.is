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
import { AppealCase, AppealEventLog, Case } from '../repository'
import { FileAppealStatementDto } from './dto/fileAppealStatement.dto'
import { AppealStatementDeadlineService } from './appealStatementDeadline.service'

// The court of appeals records that a party's statement is in, when the
// statement arrived outside the system and the court uploaded it itself. The
// same guard chain and the same two rules as the deadline route, for the same
// reasons: the handler joins the transaction CaseExistsForUpdateGuard opened,
// and RolesGuard runs ahead of the locking guard only because every rule here
// is a bare user role; appealStatementDeadlineRolesRules.spec.ts pins that.
@Controller('api/case/:caseId/appealCase/:appealCaseId/statement')
@ApiTags('appeal statements')
@UseGuards(
  JwtAuthUserGuard,
  RolesGuard,
  CaseExistsForUpdateGuard,
  new CaseTypeGuard(indictmentCases),
  AppealCaseExistsGuard,
  CaseWriteGuard,
)
export class AppealStatementController {
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
    type: AppealEventLog,
    description:
      "Records that a party's verdict appeal statement is in, filed by the court on its behalf",
  })
  async fileStatement(
    @Param('caseId') caseId: string,
    @Param('appealCaseId') appealCaseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @CurrentAppealCase() appealCase: AppealCase,
    @Body() dto: FileAppealStatementDto,
  ): Promise<AppealEventLog> {
    this.logger.debug(
      `Filing a statement on a party's behalf in appeal case ${appealCaseId} of case ${caseId}`,
    )

    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.appealStatementDeadlineService.fileStatement(
      theCase,
      appealCase,
      user,
      dto,
      transaction,
    )
  }
}
