import { Response } from 'express'
import type { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Header,
  Inject,
  NotFoundException,
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
import { AppealCaseType, UserRole } from '@island.is/judicial-system/types'

import {
  courtOfAppealsAssistantRule,
  courtOfAppealsJudgeRule,
  courtOfAppealsRegistrarRule,
  prosecutorRepresentativeRule,
  prosecutorRule,
} from '../../guards'
import { getOrCreateTransaction, registerAfterCommit } from '../../middleware'
import { CurrentCase } from '../case/guards/case.decorator'
import { CaseExistsGuard } from '../case/guards/caseExists.guard'
import { CaseExistsForUpdateGuard } from '../case/guards/caseExistsForUpdate.guard'
import { CaseReadGuard } from '../case/guards/caseRead.guard'
import { CaseWriteGuard } from '../case/guards/caseWrite.guard'
import { PdfService } from '../case/pdf.service'
import { CurrentCivilClaimant } from '../defendant/guards/civilClaimaint.decorator'
import { CivilClaimantExistsGuard } from '../defendant/guards/civilClaimantExists.guard'
import { CurrentDefendant } from '../defendant/guards/defendant.decorator'
import { DefendantExistsGuard } from '../defendant/guards/defendantExists.guard'
import { EventService } from '../event'
import { LawyerRegistryService } from '../lawyer-registry/lawyerRegistry.service'
import { AppealCase, Case, CivilClaimant, Defendant } from '../repository'
import { UserService } from '../user'
import { CreateAppealCaseDto } from './dto/createAppealCase.dto'
import { CreateAppealEventLogDto } from './dto/createAppealEventLog.dto'
import { TransitionAppealCaseDto } from './dto/transitionAppealCase.dto'
import { UpdateAppealCaseDto } from './dto/updateAppealCase.dto'
import { CurrentAppealCase } from './guards/appealCase.decorator'
import { AppealCaseExistsGuard } from './guards/appealCaseExists.guard'
import {
  courtOfAppealsAssistantTransitionRule,
  courtOfAppealsAssistantUpdateRule,
  courtOfAppealsJudgeTransitionRule,
  courtOfAppealsJudgeUpdateRule,
  courtOfAppealsRegistrarTransitionRule,
  courtOfAppealsRegistrarUpdateRule,
  districtCourtJudgeTransitionRule,
  districtCourtRegistrarTransitionRule,
  prosecutorRepresentativeTransitionRule,
  prosecutorRepresentativeUpdateRule,
  prosecutorTransitionRule,
  prosecutorUpdateRule,
  publicProsecutorStaffCreateRule,
  publicProsecutorStaffTransitionRule,
} from './guards/rolesRules'
import { buildAppealAppointmentLetter } from './appealAppointmentLetter'
import { AppealCaseService } from './appealCase.service'

@Controller('api')
@ApiTags('appeal cases')
@UseGuards(JwtAuthUserGuard)
export class AppealCaseController {
  constructor(
    private readonly appealCaseService: AppealCaseService,
    private readonly userService: UserService,
    private readonly eventService: EventService,
    private readonly pdfService: PdfService,
    private readonly lawyerRegistryService: LawyerRegistryService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  // Read in the request transaction: the caller holds a write lock on the
  // case row while this runs, and a read on a connection of its own would
  // wait for a free one from the pool while the lock is held.
  private async validateAssignedUser(
    assignedUserId: string,
    assignableUserRoles: UserRole[],
    transaction: Transaction,
  ) {
    const assignedUser = await this.userService.findById(assignedUserId, {
      transaction,
    })

    if (!assignableUserRoles.includes(assignedUser.role)) {
      throw new ForbiddenException(
        `User ${assignedUserId} does not have an acceptable role ${assignableUserRoles}`,
      )
    }
  }

  // The four routes that change an appeal case decide against a case row read
  // under FOR UPDATE, so they share one guard order:
  //
  // CaseExistsForUpdateGuard has to come before RolesGuard, because the
  // transition rules read request.case and request.appealCase
  // (userAppealedAppealCase, publicProsecutorStaffTransitionRule) and deny
  // outright when they are missing. The rules on the other three routes need
  // no case, but the order is the same on every route so there is one shape
  // to check, not two.
  //
  // RouteRolesGuard is what keeps that from exposing the lock to everyone. It
  // reads the same roles rules, but decides on the user's role alone, so it
  // needs no case and runs first: a caller in a role the route has no rule
  // for is rejected before the locking read. What remains is a caller in a
  // listed role on a case they cannot write, or with a body their rule
  // rejects - CaseWriteGuard needs the case and RolesGuard comes after the
  // read, so they still reach it. That is a much smaller population than
  // "any authenticated user". AppealCaseExistsGuard resolves the appeal case
  // from the locked case, so it comes after the read too.
  //
  // The two appointment-letter routes below only read, and keep the plain
  // CaseExistsGuard. appealCaseGuardChain.spec.ts runs these chains.
  @UseGuards(
    RouteRolesGuard,
    CaseExistsForUpdateGuard,
    RolesGuard,
    CaseWriteGuard,
  )
  @RolesRules(
    prosecutorRule,
    prosecutorRepresentativeRule,
    publicProsecutorStaffCreateRule,
  )
  @Post('case/:caseId/appealCase')
  @ApiCreatedResponse({
    type: AppealCase,
    description: 'Creates a new appeal case',
  })
  async create(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @Body() dto: CreateAppealCaseDto,
  ): Promise<AppealCase> {
    this.logger.debug(`Creating appeal case for case ${caseId}`)

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
    CaseExistsForUpdateGuard,
    AppealCaseExistsGuard,
    RolesGuard,
    CaseWriteGuard,
  )
  @RolesRules(
    prosecutorUpdateRule,
    prosecutorRepresentativeUpdateRule,
    courtOfAppealsJudgeUpdateRule,
    courtOfAppealsRegistrarUpdateRule,
    courtOfAppealsAssistantUpdateRule,
  )
  @Patch('case/:caseId/appealCase/:appealCaseId')
  @ApiOkResponse({
    type: AppealCase,
    description: 'Updates an existing appeal case',
  })
  async update(
    @Param('caseId') caseId: string,
    @Param('appealCaseId') appealCaseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @CurrentAppealCase() appealCase: AppealCase,
    @Body() updateDto: UpdateAppealCaseDto,
  ): Promise<AppealCase> {
    this.logger.debug(`Updating appeal case ${appealCaseId} of case ${caseId}`)

    // The same transaction the guard read the case in - opening one of our own
    // would block on its row lock while it waits for this handler to return,
    // which is a deadlock rather than a race.
    const transaction = await getOrCreateTransaction(this.sequelize)

    if (updateDto.appealAssistantId) {
      await this.validateAssignedUser(
        updateDto.appealAssistantId,
        [UserRole.COURT_OF_APPEALS_ASSISTANT],
        transaction,
      )
    }

    if (updateDto.appealJudge1Id) {
      await this.validateAssignedUser(
        updateDto.appealJudge1Id,
        [UserRole.COURT_OF_APPEALS_JUDGE],
        transaction,
      )
    }

    if (updateDto.appealJudge2Id) {
      await this.validateAssignedUser(
        updateDto.appealJudge2Id,
        [UserRole.COURT_OF_APPEALS_JUDGE],
        transaction,
      )
    }

    if (updateDto.appealJudge3Id) {
      await this.validateAssignedUser(
        updateDto.appealJudge3Id,
        [UserRole.COURT_OF_APPEALS_JUDGE],
        transaction,
      )
    }

    return this.appealCaseService.update(
      theCase,
      appealCase,
      updateDto,
      user,
      transaction,
    )
  }

  @UseGuards(
    RouteRolesGuard,
    CaseExistsForUpdateGuard,
    AppealCaseExistsGuard,
    RolesGuard,
    CaseWriteGuard,
  )
  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @Post('case/:caseId/appealCase/:appealCaseId/eventLog')
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
      `Creating appeal event log ${dto.eventType} on appeal case ${appealCaseId} of case ${caseId}`,
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
    CaseExistsForUpdateGuard,
    AppealCaseExistsGuard,
    RolesGuard,
    CaseWriteGuard,
  )
  @RolesRules(
    prosecutorTransitionRule,
    prosecutorRepresentativeTransitionRule,
    publicProsecutorStaffTransitionRule,
    districtCourtJudgeTransitionRule,
    districtCourtRegistrarTransitionRule,
    courtOfAppealsJudgeTransitionRule,
    courtOfAppealsRegistrarTransitionRule,
    courtOfAppealsAssistantTransitionRule,
  )
  @Patch('case/:caseId/appealCase/:appealCaseId/state')
  @ApiOkResponse({
    type: AppealCase,
    description: 'Transitions an appeal case to a new state',
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
      `Transitioning appeal case ${appealCaseId} of case ${caseId}`,
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

  /**
   * The advocate's firm, which the letter puts under their name. It lives in
   * the lawyer register rather than on the case, and only for an advocate
   * picked out of that register - one typed in by hand has no national id to
   * find them by. A letter is worth sending without the firm, so a lookup
   * that finds nothing is not an error.
   */
  private async getAdvocatePractice(
    nationalId?: string | null,
  ): Promise<string | undefined> {
    if (!nationalId) {
      return undefined
    }

    try {
      const lawyer = await this.lawyerRegistryService.getByNationalId(
        nationalId,
      )

      return lawyer.practice
    } catch {
      return undefined
    }
  }

  private async writeAppointmentLetter(
    theCase: Case,
    party: { defendant?: Defendant; civilClaimant?: CivilClaimant },
    res: Response,
  ): Promise<void> {
    const advocatePractice = await this.getAdvocatePractice(
      party.defendant?.appealDefenderNationalId ??
        party.civilClaimant?.appealSpokespersonNationalId,
    )

    const letter = buildAppealAppointmentLetter({
      theCase,
      ...party,
      advocatePractice,
    })

    if (!letter) {
      throw new NotFoundException('No appeal appointment letter to write')
    }

    res.end(await this.pdfService.getAppealAppointmentLetterPdf(letter))
  }

  @UseGuards(CaseExistsGuard, RolesGuard, CaseReadGuard, DefendantExistsGuard)
  @RolesRules(
    courtOfAppealsJudgeRule,
    courtOfAppealsRegistrarRule,
    courtOfAppealsAssistantRule,
  )
  @Get('case/:caseId/defendant/:defendantId/appealAppointmentLetter')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description:
      "Gets the letter appointing a defendant's defender for an appeal as a pdf document",
  })
  async getDefenderAppointmentLetterPdf(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.debug(
      `Getting the appeal appointment letter for defendant ${defendantId} of case ${caseId} as a pdf document`,
    )

    await this.writeAppointmentLetter(theCase, { defendant }, res)
  }

  @UseGuards(
    CaseExistsGuard,
    RolesGuard,
    CaseReadGuard,
    CivilClaimantExistsGuard,
  )
  @RolesRules(
    courtOfAppealsJudgeRule,
    courtOfAppealsRegistrarRule,
    courtOfAppealsAssistantRule,
  )
  @Get('case/:caseId/civilClaimant/:civilClaimantId/appealAppointmentLetter')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description:
      "Gets the letter appointing a civil claimant's spokesperson for an appeal as a pdf document",
  })
  async getSpokespersonAppointmentLetterPdf(
    @Param('caseId') caseId: string,
    @Param('civilClaimantId') civilClaimantId: string,
    @CurrentCase() theCase: Case,
    @CurrentCivilClaimant() civilClaimant: CivilClaimant,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.debug(
      `Getting the appeal appointment letter for civil claimant ${civilClaimantId} of case ${caseId} as a pdf document`,
    )

    await this.writeAppointmentLetter(theCase, { civilClaimant }, res)
  }
}
