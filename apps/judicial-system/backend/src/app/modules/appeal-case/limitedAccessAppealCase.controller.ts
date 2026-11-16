import { Response } from 'express'
import { Sequelize } from 'sequelize-typescript'

import {
  Body,
  Controller,
  Get,
  Header,
  Inject,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  CurrentHttpUser,
  JwtAuthUserGuard,
  RolesGuard,
  RolesRules,
  RouteRolesGuard,
} from '@island.is/judicial-system/auth'
import type { User } from '@island.is/judicial-system/types'
import {
  AppealCaseType,
  indictmentCases,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { defenderRule } from '../../guards'
import { getOrCreateTransaction, registerAfterCommit } from '../../middleware'
import { CurrentCase } from '../case/guards/case.decorator'
import { CaseReadGuard } from '../case/guards/caseRead.guard'
import { CaseTypeGuard } from '../case/guards/caseType.guard'
import { CaseWriteGuard } from '../case/guards/caseWrite.guard'
import { LimitedAccessCaseExistsGuard } from '../case/guards/limitedAccessCaseExists.guard'
import { LimitedAccessCaseExistsForUpdateGuard } from '../case/guards/limitedAccessCaseExistsForUpdate.guard'
import { CurrentCivilClaimant } from '../defendant/guards/civilClaimaint.decorator'
import { CivilClaimantExistsGuard } from '../defendant/guards/civilClaimantExists.guard'
import { CurrentDefendant } from '../defendant/guards/defendant.decorator'
import { DefendantExistsGuard } from '../defendant/guards/defendantExists.guard'
import { EventService } from '../event'
import { AppealCase, Case, CivilClaimant, Defendant } from '../repository'
import { CreateAppealCaseDto } from './dto/createAppealCase.dto'
import { CreateAppealEventLogDto } from './dto/createAppealEventLog.dto'
import { TransitionAppealCaseDto } from './dto/transitionAppealCase.dto'
import { CurrentAppealCase } from './guards/appealCase.decorator'
import { AppealCaseExistsGuard } from './guards/appealCaseExists.guard'
import { DefenceAdvocateOfPartyGuard } from './guards/defenceAdvocateOfParty.guard'
import { defenderTransitionRule } from './guards/rolesRules'
import { AppealAppointmentLetterService } from './appealAppointmentLetter.service'
import { AppealCaseService } from './appealCase.service'

@Controller('api')
@ApiTags('limited access appeal cases')
@UseGuards(JwtAuthUserGuard)
export class LimitedAccessAppealCaseController {
  constructor(
    private readonly appealCaseService: AppealCaseService,
    private readonly appealAppointmentLetterService: AppealAppointmentLetterService,
    private readonly eventService: EventService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  // The three routes that change an appeal case decide against a case row read
  // under FOR UPDATE, so they share one guard order:
  //
  // LimitedAccessCaseExistsForUpdateGuard has to come before RolesGuard,
  // because the transition rule reads request.case and request.appealCase
  // (userAppealedAppealCase) and denies outright when they are missing. The
  // rule on the other two routes needs no case, but the order is the same on
  // every route so there is one shape to check, not two.
  //
  // RouteRolesGuard is what keeps that from exposing the lock to everyone. It
  // reads the same roles rules, but decides on the user's role alone, so it
  // needs no case and runs first: a caller in a role the route has no rule
  // for is rejected before the locking read. What remains is a defender on a
  // case they cannot write, or with a body their rule rejects - CaseWriteGuard
  // needs the case and RolesGuard comes after the read, so they still reach
  // it. That is a much smaller population than "any authenticated user".
  // AppealCaseExistsGuard resolves the appeal case from the locked case, so it
  // comes after the read too.
  //
  // The two appointment-letter routes below only read, and keep the plain
  // LimitedAccessCaseExistsGuard. limitedAccessAppealCaseGuardChain.spec.ts
  // runs these chains.
  @UseGuards(
    RouteRolesGuard,
    LimitedAccessCaseExistsForUpdateGuard,
    RolesGuard,
    new CaseTypeGuard([
      ...restrictionCases,
      ...investigationCases,
      ...indictmentCases,
    ]),
    CaseWriteGuard,
  )
  @RolesRules(defenderRule)
  @Post('case/:caseId/limitedAccess/appealCase')
  @ApiCreatedResponse({
    type: AppealCase,
    description: 'Creates a new appeal case for limited access user',
  })
  async create(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @Body() dto: CreateAppealCaseDto,
  ): Promise<AppealCase> {
    this.logger.debug(`Creating limited access appeal case for case ${caseId}`)

    // The same transaction the guard read the case in - opening one of our own
    // would block on its row lock while it waits for this handler to return,
    // which is a deadlock rather than a race.
    const transaction = await getOrCreateTransaction(this.sequelize)

    const appealCase = await this.appealCaseService.create(
      theCase,
      user,
      dto.rulingFileId,
      transaction,
      dto.appealType === AppealCaseType.VERDICT ? dto : undefined,
    )

    // The event announces an appeal the database has accepted, so it is posted
    // after the commit - which TransactionCommitInterceptor does after this
    // handler has returned - as it was when the handler committed a transaction
    // of its own. Still fire and forget: a failed announcement is logged, not
    // returned to the caller.
    registerAfterCommit(() =>
      this.eventService.postEvent('CREATE_APPEAL', theCase),
    )

    return appealCase
  }

  @UseGuards(
    RouteRolesGuard,
    LimitedAccessCaseExistsForUpdateGuard,
    AppealCaseExistsGuard,
    RolesGuard,
    CaseWriteGuard,
  )
  @RolesRules(defenderRule)
  @Post('case/:caseId/limitedAccess/appealCase/:appealCaseId/eventLog')
  @ApiCreatedResponse({
    type: AppealCase,
    description: 'Records an appeal event and dispatches mapped side effects',
  })
  async createEventLog(
    @Param('caseId') caseId: string,
    @Param('appealCaseId') appealCaseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @CurrentAppealCase() appealCase: AppealCase,
    @Body() dto: CreateAppealEventLogDto,
  ): Promise<AppealCase> {
    this.logger.debug(
      `Creating appeal event log ${dto.eventType} on limited access appeal case ${appealCaseId} of case ${caseId}`,
    )

    // The same transaction the guard read the case in - opening one of our own
    // would block on its row lock while it waits for this handler to return,
    // which is a deadlock rather than a race.
    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.appealCaseService.createEventLog(
      theCase,
      appealCase,
      dto.eventType,
      user,
      transaction,
    )
  }

  @UseGuards(
    RouteRolesGuard,
    LimitedAccessCaseExistsForUpdateGuard,
    AppealCaseExistsGuard,
    RolesGuard,
    new CaseTypeGuard([
      ...restrictionCases,
      ...investigationCases,
      ...indictmentCases,
    ]),
    CaseWriteGuard,
  )
  @RolesRules(defenderTransitionRule)
  @Patch('case/:caseId/limitedAccess/appealCase/:appealCaseId/state')
  @ApiOkResponse({
    type: AppealCase,
    description: 'Transitions a limited access appeal case to a new state',
  })
  async transition(
    @Param('caseId') caseId: string,
    @Param('appealCaseId') appealCaseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @CurrentAppealCase() appealCase: AppealCase,
    @Body() dto: TransitionAppealCaseDto,
  ): Promise<AppealCase> {
    this.logger.debug(
      `Transitioning limited access appeal case ${appealCaseId} of case ${caseId}`,
    )

    // The same transaction the guard read the case in - opening one of our own
    // would block on its row lock while it waits for this handler to return,
    // which is a deadlock rather than a race.
    const transaction = await getOrCreateTransaction(this.sequelize)

    const result = await this.appealCaseService.transition(
      theCase,
      appealCase,
      dto.transition,
      user,
      transaction,
      dto.defendantId,
    )

    // The event announces a transition the database has accepted, so it is
    // posted after the commit - which TransactionCommitInterceptor does after
    // this handler has returned - as it was when the handler committed a
    // transaction of its own. Still fire and forget: a failed announcement is
    // logged, not returned to the caller.
    registerAfterCommit(() =>
      this.eventService.postEvent(dto.transition, theCase),
    )

    return result.appealCase
  }

  // The letter is addressed to the advocate, so the one it appoints - and the
  // one the district court confirmed, which is who holds access to the case -
  // reads it from the party's appeal section. The party guard keeps a defender
  // of one of the accused away from what the court sent the other's.
  @UseGuards(
    LimitedAccessCaseExistsGuard,
    RolesGuard,
    new CaseTypeGuard(indictmentCases),
    CaseReadGuard,
    DefendantExistsGuard,
    DefenceAdvocateOfPartyGuard,
  )
  @RolesRules(defenderRule)
  @Get(
    'case/:caseId/limitedAccess/defendant/:defendantId/appealAppointmentLetter',
  )
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description:
      "Gets the letter appointing a defendant's defender for an appeal as a pdf document for a limited access user",
  })
  async getDefenderAppointmentLetterPdf(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.debug(
      `Getting the appeal appointment letter for defendant ${defendantId} of case ${caseId} as a pdf document for a limited access user`,
    )

    await this.appealAppointmentLetterService.write(theCase, { defendant }, res)
  }

  @UseGuards(
    LimitedAccessCaseExistsGuard,
    RolesGuard,
    new CaseTypeGuard(indictmentCases),
    CaseReadGuard,
    CivilClaimantExistsGuard,
    DefenceAdvocateOfPartyGuard,
  )
  @RolesRules(defenderRule)
  @Get(
    'case/:caseId/limitedAccess/civilClaimant/:civilClaimantId/appealAppointmentLetter',
  )
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description:
      "Gets the letter appointing a civil claimant's spokesperson for an appeal as a pdf document for a limited access user",
  })
  async getSpokespersonAppointmentLetterPdf(
    @Param('caseId') caseId: string,
    @Param('civilClaimantId') civilClaimantId: string,
    @CurrentCase() theCase: Case,
    @CurrentCivilClaimant() civilClaimant: CivilClaimant,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.debug(
      `Getting the appeal appointment letter for civil claimant ${civilClaimantId} of case ${caseId} as a pdf document for a limited access user`,
    )

    await this.appealAppointmentLetterService.write(
      theCase,
      { civilClaimant },
      res,
    )
  }
}
