import { Sequelize } from 'sequelize-typescript'

import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  JwtAuthUserGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

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
import { AppealCase, AppealCourtSession, Case } from '../repository'
import { CreateAppealCourtSessionDto } from './dto/createAppealCourtSession.dto'
import { DeleteAppealCourtSessionResponse } from './dto/deleteAppealCourtSession.response'
import { UpdateAppealCourtSessionDto } from './dto/updateAppealCourtSession.dto'
import { CurrentAppealCourtSession } from './guards/appealCourtSession.decorator'
import { AppealCourtSessionExistsGuard } from './guards/appealCourtSessionExists.guard'
import { AppealCourtSessionService } from './appealCourtSession.service'

// Every route here changes the sessions of a verdict appeal.
// CaseExistsForUpdateGuard reads the case under FOR UPDATE in the request's
// transaction, so two of these requests on one case serialize on the case row
// and the second sees the first's commit. The handlers join that transaction
// rather than open one of their own, which would block on the guard's row
// lock while the guard waits for the handler: a deadlock, not a race.
//
// RolesGuard runs first, ahead of the guard that takes the write lock. It
// can, because every route's three rules are bare user roles with no
// canActivate, so none of them reads request.case and a caller this
// controller has no rule for is turned away before any case row is locked.
// appealCourtSessionRolesRules.spec.ts pins that assumption.
//
// The guards after the locking read all decide from request.case and so see
// the locked row, including AppealCaseExistsGuard and, on the routes that
// name a session, AppealCourtSessionExistsGuard.
@Controller('api/case/:caseId/appealCase/:appealCaseId/courtSession')
@ApiTags('appeal court sessions')
@UseGuards(
  JwtAuthUserGuard,
  RolesGuard,
  CaseExistsForUpdateGuard,
  new CaseTypeGuard(indictmentCases),
  AppealCaseExistsGuard,
  CaseWriteGuard,
)
export class AppealCourtSessionController {
  constructor(
    private readonly appealCourtSessionService: AppealCourtSessionService,
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
    type: AppealCourtSession,
    description: 'Creates a court session in a verdict appeal',
  })
  async create(
    @Param('caseId') caseId: string,
    @Param('appealCaseId') appealCaseId: string,
    @CurrentCase() theCase: Case,
    @CurrentAppealCase() appealCase: AppealCase,
    @Body() dto: CreateAppealCourtSessionDto,
  ): Promise<AppealCourtSession> {
    this.logger.debug(
      `Creating a court session in appeal case ${appealCaseId} of case ${caseId}`,
    )

    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.appealCourtSessionService.create(
      theCase,
      appealCase,
      dto,
      transaction,
    )
  }

  @RolesRules(
    courtOfAppealsJudgeRule,
    courtOfAppealsRegistrarRule,
    courtOfAppealsAssistantRule,
  )
  @UseGuards(AppealCourtSessionExistsGuard)
  @Patch(':appealCourtSessionId')
  @ApiOkResponse({
    type: AppealCourtSession,
    description: 'Updates a court session in a verdict appeal',
  })
  async update(
    @Param('caseId') caseId: string,
    @Param('appealCaseId') appealCaseId: string,
    @Param('appealCourtSessionId') appealCourtSessionId: string,
    @CurrentCase() theCase: Case,
    @CurrentAppealCase() appealCase: AppealCase,
    @CurrentAppealCourtSession() session: AppealCourtSession,
    @Body() dto: UpdateAppealCourtSessionDto,
  ): Promise<AppealCourtSession> {
    this.logger.debug(
      `Updating court session ${appealCourtSessionId} in appeal case ${appealCaseId} of case ${caseId}`,
    )

    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.appealCourtSessionService.update(
      theCase,
      appealCase,
      session,
      dto,
      transaction,
    )
  }

  @RolesRules(
    courtOfAppealsJudgeRule,
    courtOfAppealsRegistrarRule,
    courtOfAppealsAssistantRule,
  )
  @UseGuards(AppealCourtSessionExistsGuard)
  @Delete(':appealCourtSessionId')
  @ApiOkResponse({
    type: DeleteAppealCourtSessionResponse,
    description: 'Deletes a court session in a verdict appeal',
  })
  async delete(
    @Param('caseId') caseId: string,
    @Param('appealCaseId') appealCaseId: string,
    @Param('appealCourtSessionId') appealCourtSessionId: string,
    @CurrentCase() theCase: Case,
    @CurrentAppealCase() appealCase: AppealCase,
    @CurrentAppealCourtSession() session: AppealCourtSession,
  ): Promise<DeleteAppealCourtSessionResponse> {
    this.logger.debug(
      `Deleting court session ${appealCourtSessionId} in appeal case ${appealCaseId} of case ${caseId}`,
    )

    const transaction = await getOrCreateTransaction(this.sequelize)

    const deleted = await this.appealCourtSessionService.delete(
      theCase,
      appealCase,
      session,
      transaction,
    )

    return { deleted }
  }
}
