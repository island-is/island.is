import { Response } from 'express'
import { Sequelize } from 'sequelize-typescript'

import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  CurrentHttpUser,
  JwtAuthUserGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import {
  AppealSummonsAction,
  canPerformAppealSummonsAction,
  indictmentCases,
  type User,
} from '@island.is/judicial-system/types'

import {
  courtOfAppealsAssistantRule,
  courtOfAppealsJudgeRule,
  courtOfAppealsRegistrarRule,
  prosecutorRule,
  publicProsecutorStaffRule,
} from '../../guards'
import { getOrCreateTransaction } from '../../middleware'
import {
  CaseExistsForUpdateGuard,
  CaseExistsGuard,
  CaseReadGuard,
  CaseTypeGuard,
  CaseWriteGuard,
  CurrentCase,
  PdfService,
} from '../case'
import { AppealSummons, Case } from '../repository'
import { CreateAppealSummonsDto } from './dto/createAppealSummons.dto'
import { PreviewAppealSummonsDto } from './dto/previewAppealSummons.dto'
import { CurrentAppealSummons } from './guards/appealSummons.decorator'
import { AppealSummonsExistsGuard } from './guards/appealSummonsExists.guard'
import { DeleteAppealSummonsResponse } from './models/deleteAppealSummons.response'
import { AppealSummonsService } from './appealSummons.service'

// The four routes that change an appeal summons - create, update, delete and
// sendToCourtOfAppeals - decide against the case row they read: create resolves
// the defendants and their appellant sides from the case's verdict appeal, and
// the others act on the summons that AppealSummonsExistsGuard found on that
// case. Each of them reads the case under FOR UPDATE through the locking
// exists guard, so the decision is made against a row no one else can change
// until the request's transaction commits.
//
// That guard cannot sit at class level: confirm awaits an upload to S3 inside
// a transaction of its own, and getPdf and preview only read, so those three
// keep the plain exists guard - a lock held across an external call, or taken
// for a read, is exactly what the locking guard must not do. Every route
// therefore lists its own exists guard first, and CaseTypeGuard and the access
// guard move with it: both decide from request.case, so they have to follow
// whichever guard put the case there.
//
// RolesGuard stays at class level, ahead of the locking read. It can, because
// every rule on this controller is a bare user role with no canActivate: none
// reads request.case, so a caller a route has no rule for is turned away
// before any case row is locked. appealSummonsGuardChain.spec.ts runs the
// seven chains.
@Controller('api/case/:caseId/appealSummons')
@ApiTags('appeal summonses')
@UseGuards(JwtAuthUserGuard, RolesGuard)
export class AppealSummonsController {
  constructor(
    private readonly appealSummonsService: AppealSummonsService,
    private readonly pdfService: PdfService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  // The three mutating routes carry the write guard. For the one role they
  // admit, public prosecution staff, it decides exactly as the read guard did:
  // canUserAccessCase routes that role through canPublicProsecutionUserAccessCase,
  // which does not look at whether the access is for an update.
  @UseGuards(
    CaseExistsForUpdateGuard,
    new CaseTypeGuard(indictmentCases),
    CaseWriteGuard,
  )
  @RolesRules(publicProsecutorStaffRule)
  @Post()
  @ApiCreatedResponse({
    type: AppealSummons,
    description: 'Creates an appeal summons',
  })
  async create(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Body() dto: CreateAppealSummonsDto,
    @CurrentHttpUser() user: User,
  ): Promise<AppealSummons> {
    this.logger.debug(`Creating an appeal summons for case ${caseId}`)

    // The same transaction the guard read the case in - opening one of our own
    // would block on its row lock while it waits for this handler to return,
    // which is a deadlock rather than a race.
    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.appealSummonsService.create(theCase, dto, user, transaction)
  }

  @UseGuards(
    CaseExistsForUpdateGuard,
    new CaseTypeGuard(indictmentCases),
    CaseWriteGuard,
    AppealSummonsExistsGuard,
  )
  @RolesRules(publicProsecutorStaffRule)
  @Patch(':appealSummonsId')
  @ApiOkResponse({
    type: AppealSummons,
    description: 'Updates an appeal summons',
  })
  async update(
    @Param('caseId') caseId: string,
    @Param('appealSummonsId') appealSummonsId: string,
    @CurrentCase() theCase: Case,
    @CurrentAppealSummons() summons: AppealSummons,
    @Body() dto: CreateAppealSummonsDto,
    @CurrentHttpUser() user: User,
  ): Promise<AppealSummons> {
    this.logger.debug(
      `Updating appeal summons ${appealSummonsId} of case ${caseId}`,
    )

    // The same transaction the guard read the case in - opening one of our own
    // would block on its row lock while it waits for this handler to return,
    // which is a deadlock rather than a race.
    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.appealSummonsService.update(
      theCase,
      summons,
      dto,
      user,
      transaction,
    )
  }

  @UseGuards(
    CaseExistsForUpdateGuard,
    new CaseTypeGuard(indictmentCases),
    CaseWriteGuard,
    AppealSummonsExistsGuard,
  )
  @RolesRules(publicProsecutorStaffRule)
  @Delete(':appealSummonsId')
  @ApiOkResponse({
    type: DeleteAppealSummonsResponse,
    description: 'Deletes an appeal summons',
  })
  async delete(
    @Param('caseId') caseId: string,
    @Param('appealSummonsId') appealSummonsId: string,
    @CurrentCase() theCase: Case,
    @CurrentAppealSummons() summons: AppealSummons,
    @CurrentHttpUser() user: User,
  ): Promise<DeleteAppealSummonsResponse> {
    this.logger.debug(
      `Deleting appeal summons ${appealSummonsId} of case ${caseId}`,
    )

    // The same transaction the guard read the case in - opening one of our own
    // would block on its row lock while it waits for this handler to return,
    // which is a deadlock rather than a race.
    const transaction = await getOrCreateTransaction(this.sequelize)

    const deleted = await this.appealSummonsService.delete(
      theCase,
      summons,
      user,
      transaction,
    )

    return { deleted }
  }

  // Not converted to the locking read: confirming renders the summons and
  // awaits its upload to S3 before the hash is persisted, all inside the
  // transaction, and a FOR UPDATE lock on the case row must not be held across
  // an external call. The route keeps the plain read and a transaction of its
  // own.
  //
  // The read guard rather than the write guard, on purpose. A summons is
  // confirmed by any prosecutor at the public prosecution office
  // (canConfirmAppealSummons), and such a prosecutor reaches an appealed case
  // only through the read-only fallback in canUserAccessCase - the write rule
  // admits the case's own office, its reviewer and its appeal prosecutor. The
  // write guard here would narrow confirmation to those assignees, which is a
  // product decision not taken.
  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    CaseReadGuard,
    AppealSummonsExistsGuard,
  )
  @RolesRules(prosecutorRule)
  @Patch(':appealSummonsId/confirm')
  @ApiOkResponse({
    type: AppealSummons,
    description: 'Confirms an appeal summons',
  })
  confirm(
    @Param('caseId') caseId: string,
    @Param('appealSummonsId') appealSummonsId: string,
    @CurrentCase() theCase: Case,
    @CurrentAppealSummons() summons: AppealSummons,
    @CurrentHttpUser() user: User,
  ): Promise<AppealSummons> {
    this.logger.debug(
      `Confirming appeal summons ${appealSummonsId} of case ${caseId}`,
    )

    return this.sequelize.transaction((transaction) =>
      this.appealSummonsService.confirm(theCase, summons, user, transaction),
    )
  }

  @UseGuards(
    CaseExistsForUpdateGuard,
    new CaseTypeGuard(indictmentCases),
    CaseWriteGuard,
    AppealSummonsExistsGuard,
  )
  @RolesRules(publicProsecutorStaffRule)
  @Patch(':appealSummonsId/sendToCourtOfAppeals')
  @ApiOkResponse({
    type: AppealSummons,
    description: 'Sends an appeal summons to the court of appeals',
  })
  async sendToCourtOfAppeals(
    @Param('caseId') caseId: string,
    @Param('appealSummonsId') appealSummonsId: string,
    @CurrentCase() theCase: Case,
    @CurrentAppealSummons() summons: AppealSummons,
    @CurrentHttpUser() user: User,
  ): Promise<AppealSummons> {
    this.logger.debug(
      `Sending appeal summons ${appealSummonsId} of case ${caseId} to the court of appeals`,
    )

    // The same transaction the guard read the case in - opening one of our own
    // would block on its row lock while it waits for this handler to return,
    // which is a deadlock rather than a race.
    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.appealSummonsService.sendToCourtOfAppeals(
      theCase,
      summons,
      user,
      transaction,
    )
  }

  // A read: no lock.
  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    CaseReadGuard,
    AppealSummonsExistsGuard,
  )
  @RolesRules(
    publicProsecutorStaffRule,
    prosecutorRule,
    courtOfAppealsJudgeRule,
    courtOfAppealsRegistrarRule,
    courtOfAppealsAssistantRule,
  )
  @Get(':appealSummonsId/pdf')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Gets an appeal summons as a pdf document',
  })
  async getPdf(
    @Param('caseId') caseId: string,
    @Param('appealSummonsId') appealSummonsId: string,
    @CurrentCase() theCase: Case,
    @CurrentAppealSummons() summons: AppealSummons,
    @CurrentHttpUser() user: User,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.debug(
      `Getting appeal summons ${appealSummonsId} of case ${caseId} as a pdf document`,
    )

    // CoA may open only after send; staff/prosecutors keep broader OPEN rights.
    if (
      !canPerformAppealSummonsAction(AppealSummonsAction.OPEN, summons, user)
    ) {
      throw new ForbiddenException(
        `User ${user.id} cannot open appeal summons ${appealSummonsId}`,
      )
    }

    const pdf = await this.pdfService.getAppealSummonsPdf(
      theCase,
      user,
      summons,
    )

    res.end(pdf)
  }

  // A read: no lock.
  @UseGuards(CaseExistsGuard, new CaseTypeGuard(indictmentCases), CaseReadGuard)
  @RolesRules(publicProsecutorStaffRule)
  @Post('preview')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Previews an unsaved appeal summons as a pdf document',
  })
  async preview(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Body() dto: PreviewAppealSummonsDto,
    @CurrentHttpUser() user: User,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.debug(`Previewing an appeal summons pdf for case ${caseId}`)

    const defendants = await this.appealSummonsService.resolvePreviewDefendants(
      theCase,
      dto,
    )
    const pdf = await this.pdfService.getAppealSummonsPdf(
      theCase,
      user,
      undefined,
      defendants,
    )

    res.end(pdf)
  }
}
