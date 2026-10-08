import { Response } from 'express'
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
import { CurrentCase } from '../case/guards/case.decorator'
import { CaseExistsGuard } from '../case/guards/caseExists.guard'
import { CaseReadGuard } from '../case/guards/caseRead.guard'
import { CaseWriteGuard } from '../case/guards/caseWrite.guard'
import { PdfService } from '../case/pdf.service'
import { CurrentCivilClaimant } from '../defendant/guards/civilClaimaint.decorator'
import { CivilClaimantExistsGuard } from '../defendant/guards/civilClaimantExists.guard'
import { CurrentDefendant } from '../defendant/guards/defendant.decorator'
import { DefendantExistsGuard } from '../defendant/guards/defendantExists.guard'
import { EventService } from '../event'
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
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private async validateAssignedUser(
    assignedUserId: string,
    assignableUserRoles: UserRole[],
  ) {
    const assignedUser = await this.userService.findById(assignedUserId)

    if (!assignableUserRoles.includes(assignedUser.role)) {
      throw new ForbiddenException(
        `User ${assignedUserId} does not have an acceptable role ${assignableUserRoles}`,
      )
    }
  }

  @UseGuards(CaseExistsGuard, RolesGuard, CaseWriteGuard)
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

    const appealCase = await this.sequelize.transaction((transaction) =>
      this.appealCaseService.create(
        theCase,
        user,
        dto.rulingFileId,
        transaction,
        dto.appealType === AppealCaseType.VERDICT ? dto : undefined,
      ),
    )

    this.eventService.postEvent('CREATE_APPEAL', theCase)

    return appealCase
  }

  @UseGuards(CaseExistsGuard, AppealCaseExistsGuard, RolesGuard, CaseWriteGuard)
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

    if (updateDto.appealAssistantId) {
      await this.validateAssignedUser(updateDto.appealAssistantId, [
        UserRole.COURT_OF_APPEALS_ASSISTANT,
      ])
    }

    if (updateDto.appealJudge1Id) {
      await this.validateAssignedUser(updateDto.appealJudge1Id, [
        UserRole.COURT_OF_APPEALS_JUDGE,
      ])
    }

    if (updateDto.appealJudge2Id) {
      await this.validateAssignedUser(updateDto.appealJudge2Id, [
        UserRole.COURT_OF_APPEALS_JUDGE,
      ])
    }

    if (updateDto.appealJudge3Id) {
      await this.validateAssignedUser(updateDto.appealJudge3Id, [
        UserRole.COURT_OF_APPEALS_JUDGE,
      ])
    }

    return this.sequelize.transaction((transaction) =>
      this.appealCaseService.update(
        theCase,
        appealCase,
        updateDto,
        user,
        transaction,
      ),
    )
  }

  @UseGuards(CaseExistsGuard, AppealCaseExistsGuard, RolesGuard, CaseWriteGuard)
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

    return this.sequelize.transaction((transaction) =>
      this.appealCaseService.createEventLog(
        theCase,
        appealCase,
        dto.eventType,
        user,
        transaction,
      ),
    )
  }

  @UseGuards(CaseExistsGuard, AppealCaseExistsGuard, RolesGuard, CaseWriteGuard)
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

    const result = await this.sequelize.transaction((transaction) =>
      this.appealCaseService.transition(
        theCase,
        appealCase,
        dto.transition,
        user,
        transaction,
        dto.defendantId,
      ),
    )

    this.eventService.postEvent(dto.transition, theCase)

    return result.appealCase
  }

  private async writeAppointmentLetter(
    theCase: Case,
    party: { defendant?: Defendant; civilClaimant?: CivilClaimant },
    res: Response,
  ): Promise<void> {
    const letter = buildAppealAppointmentLetter({ theCase, ...party })

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
