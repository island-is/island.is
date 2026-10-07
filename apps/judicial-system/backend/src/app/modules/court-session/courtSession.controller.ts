import { Sequelize } from 'sequelize-typescript'

import {
  BadRequestException,
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

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  CurrentHttpUser,
  JwtAuthUserGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import { indictmentCases, type User } from '@island.is/judicial-system/types'

import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
} from '../../guards'
import { getOrCreateTransaction } from '../../middleware'
import {
  CaseExistsForUpdateGuard,
  CaseTypeGuard,
  CaseWriteGuard,
  CurrentCase,
} from '../case'
import {
  AppealDecision,
  Case,
  CourtSession,
  CourtSessionString,
} from '../repository'
import { CourtSessionAppealDecisionDto } from './dto/courtSessionAppealDecision.dto'
import { CourtSessionStringDto } from './dto/CourtSessionStringDto.dto'
import { DeleteCourtSessionResponse } from './dto/deleteCourtSession.response'
import { UpdateCourtSessionDto } from './dto/updateCourtSession.dto'
import { CurrentCourtSession } from './guards/courtSession.decorator'
import { CourtSessionExistsGuard } from './guards/courtSessionExists.guard'
import { CourtSessionService } from './courtSession.service'

// Every route here changes the case's court sessions, and each decides what
// to change from the case the guard loaded: delete checks the session is the
// latest against theCase.courtSessions, update and the ruling routes decide
// from the session and the files on that snapshot. CaseExistsForUpdateGuard
// reads the case under FOR UPDATE in the request's transaction, so two of
// these requests on one case serialize on the case row and the second sees
// the first's commit - a create and a delete can no longer both decide
// against the same latest session.
//
// RolesGuard runs first, ahead of the guard that takes the write lock. It
// can, because every route's three rules are bare user roles with no
// canActivate: none of them reads request.case, so a caller this controller
// has no rule for is turned away before any case row is locked.
// courtSessionRolesRules.spec.ts pins that assumption, so a rule that starts
// reading the case cannot silently reopen the exposure.
//
// The guards after the locking read all decide from request.case and so see
// the locked row - including CourtSessionExistsGuard on the routes that
// name a session.
@Controller('api/case/:caseId/courtSession')
@ApiTags('court-sessions')
@UseGuards(
  JwtAuthUserGuard,
  RolesGuard,
  CaseExistsForUpdateGuard,
  new CaseTypeGuard(indictmentCases),
  CaseWriteGuard,
)
export class CourtSessionController {
  constructor(
    private readonly courtSessionService: CourtSessionService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @RolesRules(
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Post()
  @ApiCreatedResponse({
    type: CourtSession,
    description: 'Creates a new court session',
  })
  async create(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
  ): Promise<CourtSession> {
    this.logger.debug(`Creating a new court session for case ${caseId}`)

    // The same transaction the guard read the case in - opening one of our own
    // would block on its row lock while it waits for this handler to return,
    // which is a deadlock rather than a race.
    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.courtSessionService.create(theCase, transaction)
  }

  @UseGuards(CourtSessionExistsGuard)
  @RolesRules(
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Patch(':courtSessionId')
  @ApiOkResponse({
    type: CourtSession,
    description: 'Updates a court session',
  })
  async update(
    @Param('caseId') caseId: string,
    @Param('courtSessionId') courtSessionId: string,
    @Body() courtSessionToUpdate: UpdateCourtSessionDto,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @CurrentCourtSession() courtSession: CourtSession,
  ): Promise<CourtSession> {
    this.logger.debug(
      `Updating court session ${courtSessionId} of case ${caseId}`,
    )

    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.courtSessionService.update(
      theCase,
      courtSession,
      courtSessionToUpdate,
      user,
      transaction,
    )
  }

  @UseGuards(CourtSessionExistsGuard)
  @RolesRules(
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Patch(':courtSessionId/courtSessionString')
  @ApiOkResponse({
    type: CourtSessionString,
    description: 'Creates or updates a court session string',
  })
  async createOrUpdateCourtSessionString(
    @Param('caseId') caseId: string,
    @Param('courtSessionId') courtSessionId: string,
    @Body() courtSessionString: CourtSessionStringDto,
  ): Promise<CourtSessionString> {
    this.logger.debug(
      `Updating court session string of ${courtSessionId} of case ${caseId}`,
    )

    // This route used to write without a transaction. The guard has opened the
    // request's transaction to lock the case row, so the write joins it rather
    // than autocommitting beside a lock held on its behalf.
    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.courtSessionService.createOrUpdateCourtSessionString({
      caseId,
      courtSessionId,
      mergedCaseId: courtSessionString.mergedCaseId,
      update: courtSessionString,
      transaction,
    })
  }

  @UseGuards(CourtSessionExistsGuard)
  @RolesRules(
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Patch(':courtSessionId/appealDecision')
  @ApiOkResponse({
    type: AppealDecision,
    description:
      'Creates or updates a party appeal decision recorded in a court session',
  })
  async upsertAppealDecision(
    @Param('caseId') caseId: string,
    @Param('courtSessionId') courtSessionId: string,
    @Body() appealDecision: CourtSessionAppealDecisionDto,
    @CurrentCase() theCase: Case,
    @CurrentCourtSession() courtSession: CourtSession,
  ): Promise<AppealDecision> {
    this.logger.debug(
      `Upserting appeal decision for court session ${courtSessionId} of case ${caseId}`,
    )

    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.courtSessionService.upsertAppealDecision(
      theCase,
      courtSession,
      appealDecision,
      transaction,
    )
  }

  @UseGuards(CourtSessionExistsGuard)
  @RolesRules(
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Post(':courtSessionId/pronounceRulingOrally')
  @ApiOkResponse({
    type: CourtSession,
    description:
      'Pronounces a ruling order orally in a court session, creating the ruling the district court writes up if it is appealed',
  })
  async pronounceRulingOrally(
    @Param('caseId') caseId: string,
    @Param('courtSessionId') courtSessionId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @CurrentCourtSession() courtSession: CourtSession,
  ): Promise<CourtSession> {
    this.logger.debug(
      `Pronouncing a ruling orally in court session ${courtSessionId} of case ${caseId}`,
    )

    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.courtSessionService.pronounceRulingOrally(
      theCase,
      courtSession,
      user,
      transaction,
    )
  }

  @UseGuards(CourtSessionExistsGuard)
  @RolesRules(
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Delete(':courtSessionId')
  @ApiOkResponse({
    type: DeleteCourtSessionResponse,
    description: 'Deletes a court session',
  })
  async delete(
    @Param('caseId') caseId: string,
    @Param('courtSessionId') courtSessionId: string,
    @CurrentCase() theCase: Case,
    @CurrentCourtSession() courtSession: CourtSession,
  ): Promise<DeleteCourtSessionResponse> {
    this.logger.debug(
      `Deleting court session ${courtSessionId} of case ${caseId}`,
    )

    // Only allow users to delete the latest court session and only if there are more than one.
    //
    // CaseExistsForUpdateGuard read this case under FOR UPDATE, so the list is
    // decided against a row no one else can change: a create that would make
    // this session no longer the latest waits for this request to commit, and
    // then sees one session fewer. The service re-reads the latest session in
    // the same transaction and refuses with a 500 if it disagrees - that is the
    // check against the database's own view, cheap, and it guards the service
    // against a caller that passes a stale case, so both stay.
    const courtSessions = theCase.courtSessions
    if (
      !courtSessions ||
      courtSessions.length === 0 ||
      courtSessionId !== courtSessions[courtSessions.length - 1].id
    ) {
      throw new BadRequestException(
        `Could not delete court session ${courtSessionId} of case ${caseId}. Only the latest court session can be deleted.`,
      )
    }

    const transaction = await getOrCreateTransaction(this.sequelize)

    const deleted = await this.courtSessionService.delete(
      theCase,
      courtSession,
      transaction,
    )

    return { deleted }
  }
}
