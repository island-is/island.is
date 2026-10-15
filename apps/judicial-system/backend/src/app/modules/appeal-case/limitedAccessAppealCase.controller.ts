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
} from '@island.is/judicial-system/auth'
import type { User } from '@island.is/judicial-system/types'
import {
  AppealCaseType,
  indictmentCases,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { defenderRule } from '../../guards'
import { CurrentCase } from '../case/guards/case.decorator'
import { CaseReadGuard } from '../case/guards/caseRead.guard'
import { CaseTypeGuard } from '../case/guards/caseType.guard'
import { CaseWriteGuard } from '../case/guards/caseWrite.guard'
import { LimitedAccessCaseExistsGuard } from '../case/guards/limitedAccessCaseExists.guard'
import { PdfService } from '../case/pdf.service'
import { CurrentCivilClaimant } from '../defendant/guards/civilClaimaint.decorator'
import { CivilClaimantExistsGuard } from '../defendant/guards/civilClaimantExists.guard'
import { CurrentDefendant } from '../defendant/guards/defendant.decorator'
import { DefendantExistsGuard } from '../defendant/guards/defendantExists.guard'
import { EventService } from '../event'
import { LawyerRegistryService } from '../lawyer-registry/lawyerRegistry.service'
import { AppealCase, Case, CivilClaimant, Defendant } from '../repository'
import { CreateAppealCaseDto } from './dto/createAppealCase.dto'
import { CreateAppealEventLogDto } from './dto/createAppealEventLog.dto'
import { TransitionAppealCaseDto } from './dto/transitionAppealCase.dto'
import { CurrentAppealCase } from './guards/appealCase.decorator'
import { AppealCaseExistsGuard } from './guards/appealCaseExists.guard'
import { DefenceAdvocateOfPartyGuard } from './guards/defenceAdvocateOfParty.guard'
import { defenderTransitionRule } from './guards/rolesRules'
import { writeAppealAppointmentLetter } from './appealAppointmentLetter'
import { AppealCaseService } from './appealCase.service'

@Controller('api')
@ApiTags('limited access appeal cases')
@UseGuards(JwtAuthUserGuard)
export class LimitedAccessAppealCaseController {
  constructor(
    private readonly appealCaseService: AppealCaseService,
    private readonly pdfService: PdfService,
    private readonly lawyerRegistryService: LawyerRegistryService,
    private readonly eventService: EventService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(
    LimitedAccessCaseExistsGuard,
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

  @UseGuards(
    LimitedAccessCaseExistsGuard,
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

  @UseGuards(
    LimitedAccessCaseExistsGuard,
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

    await writeAppealAppointmentLetter({
      theCase,
      party: { defendant },
      res,
      pdfService: this.pdfService,
      lawyerRegistryService: this.lawyerRegistryService,
    })
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

    await writeAppealAppointmentLetter({
      theCase,
      party: { civilClaimant },
      res,
      pdfService: this.pdfService,
      lawyerRegistryService: this.lawyerRegistryService,
    })
  }
}
