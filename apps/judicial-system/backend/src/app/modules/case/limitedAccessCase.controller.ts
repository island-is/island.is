import { Response } from 'express'

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Inject,
  Param,
  Patch,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  CurrentHttpUser,
  JwtAuthGuard,
  RolesGuard,
  RolesRules,
  TokenGuard,
} from '@island.is/judicial-system/auth'
import type { User as TUser } from '@island.is/judicial-system/types'
import {
  CaseState,
  CaseType,
  indictmentCases,
  investigationCases,
  restrictionCases,
  UserRole,
} from '@island.is/judicial-system/types'

import { nowFactory } from '../../factories'
import { defenderRule, prisonSystemStaffRule } from '../../guards'
import { EventService } from '../event'
import { User } from '../user'
import { TransitionCaseDto } from './dto/transitionCase.dto'
import { UpdateCaseDto } from './dto/updateCase.dto'
import { CurrentCase } from './guards/case.decorator'
import { CaseCompletedGuard } from './guards/caseCompleted.guard'
import { CaseExistsGuard } from './guards/caseExists.guard'
import { CaseReadGuard } from './guards/caseRead.guard'
import { CaseTypeGuard } from './guards/caseType.guard'
import { CaseWriteGuard } from './guards/caseWrite.guard'
import { LimitedAccessCaseExistsGuard } from './guards/limitedAccessCaseExists.guard'
import { MergedCaseExistsGuard } from './guards/mergedCaseExists.guard'
import { RequestSharedWithDefenderGuard } from './guards/requestSharedWithDefender.guard'
import {
  defenderGeneratedPdfRule,
  defenderTransitionRule,
  defenderUpdateRule,
} from './guards/rolesRules'
import { CaseInterceptor } from './interceptors/case.interceptor'
import { CompletedAppealAccessedInterceptor } from './interceptors/completedAppealAccessed.interceptor'
import { DefendantIndictmentAccessedInterceptor } from './interceptors/defendantIndictmentAccessed.interceptor'
import { LimitedAccessCaseFileInterceptor } from './interceptors/limitedAccessCaseFile.interceptor'
import { Case } from './models/case.model'
import { transitionCase } from './state/case.state'
import {
  LimitedAccessCaseService,
  LimitedAccessUpdateCase,
} from './limitedAccessCase.service'
import { PdfService } from './pdf.service'

@Controller('api')
@ApiTags('limited access cases')
export class LimitedAccessCaseController {
  constructor(
    private readonly limitedAccessCaseService: LimitedAccessCaseService,
    private readonly eventService: EventService,
    private readonly pdfService: PdfService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
    LimitedAccessCaseExistsGuard,
    CaseReadGuard,
  )
  @RolesRules(prisonSystemStaffRule, defenderRule)
  @UseInterceptors(
    DefendantIndictmentAccessedInterceptor,
    CompletedAppealAccessedInterceptor,
    LimitedAccessCaseFileInterceptor,
    CaseInterceptor,
  )
  @Get('case/:caseId/limitedAccess')
  @ApiOkResponse({
    type: Case,
    description: 'Gets a limited set of properties of an existing case',
  })
  async getById(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @CurrentHttpUser() user: TUser,
  ): Promise<Case> {
    this.logger.debug(`Getting limitedAccess case ${caseId} by id`)

    if (user.role === UserRole.DEFENDER && !theCase.openedByDefender) {
      const updated = await this.limitedAccessCaseService.update(
        theCase,
        { openedByDefender: nowFactory() },
        user,
      )
      return updated
    }

    return theCase
  }

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
    LimitedAccessCaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseWriteGuard,
    CaseCompletedGuard,
  )
  @RolesRules(defenderUpdateRule)
  @UseInterceptors(CaseInterceptor)
  @Patch('case/:caseId/limitedAccess')
  @ApiOkResponse({ type: Case, description: 'Updates an existing case' })
  update(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: TUser,
    @CurrentCase() theCase: Case,
    @Body() updateDto: UpdateCaseDto,
  ): Promise<Case> {
    this.logger.debug(`Updating limitedAccess case ${caseId}`)

    const update: LimitedAccessUpdateCase = updateDto

    if (update.defendantStatementDate) {
      update.defendantStatementDate = nowFactory()
    }

    return this.limitedAccessCaseService.update(theCase, update, user)
  }

  @UseGuards(
    JwtAuthGuard,
    LimitedAccessCaseExistsGuard,
    RolesGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseWriteGuard,
    CaseCompletedGuard,
  )
  @RolesRules(defenderTransitionRule)
  @UseInterceptors(CaseInterceptor)
  @Patch('case/:caseId/limitedAccess/state')
  @ApiOkResponse({
    type: Case,
    description: 'Updates the state of a case',
  })
  async transition(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: TUser,
    @CurrentCase() theCase: Case,
    @Body() transition: TransitionCaseDto,
  ): Promise<Case> {
    this.logger.debug(
      `Transitioning case ${caseId} to ${transition.transition}`,
    )

    const update = transitionCase(transition.transition, theCase, user)

    const updatedCase = await this.limitedAccessCaseService.update(
      theCase,
      update,
      user,
    )

    this.eventService.postEvent(transition.transition, updatedCase)

    return updatedCase
  }

  @UseGuards(TokenGuard)
  @Get('cases/limitedAccess/defender')
  @ApiOkResponse({
    type: User,
    description: 'Gets a defender by national id',
  })
  findDefenderByNationalId(
    @Query('nationalId') nationalId: string,
  ): Promise<User> {
    this.logger.debug(`Getting a defender by national id`)

    return this.limitedAccessCaseService.findDefenderByNationalId(nationalId)
  }

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseReadGuard,
    RequestSharedWithDefenderGuard,
  )
  @RolesRules(defenderRule)
  @Get('case/:caseId/limitedAccess/request')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Gets the request for an existing case as a pdf document',
  })
  async getRequestPdf(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.debug(
      `Getting the request for case ${caseId} as a pdf document`,
    )

    const pdf = await this.pdfService.getRequestPdf(theCase)

    res.end(pdf)
  }

  @UseGuards(
    JwtAuthGuard,
    CaseExistsGuard,
    RolesGuard,
    new CaseTypeGuard(indictmentCases),
    CaseReadGuard,
    MergedCaseExistsGuard,
  )
  @RolesRules(defenderGeneratedPdfRule)
  @Get([
    'case/:caseId/limitedAccess/caseFilesRecord/:policeCaseNumber',
    'case/:caseId/limitedAccess/mergedCase/:mergedCaseId/caseFilesRecord/:policeCaseNumber',
  ])
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description:
      'Gets the case files record for an existing case as a pdf document',
  })
  async getCaseFilesRecordPdf(
    @Param('caseId') caseId: string,
    @Param('policeCaseNumber') policeCaseNumber: string,
    @CurrentCase() theCase: Case,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.debug(
      `Getting the case files record for case ${caseId} and police case ${policeCaseNumber} as a pdf document`,
    )

    if (!theCase.policeCaseNumbers.includes(policeCaseNumber)) {
      throw new BadRequestException(
        `Case ${caseId} does not include police case number ${policeCaseNumber}`,
      )
    }

    const pdf = await this.pdfService.getCaseFilesRecordPdf(
      theCase,
      policeCaseNumber,
    )

    res.end(pdf)
  }

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseReadGuard,
    CaseCompletedGuard,
  )
  @RolesRules(prisonSystemStaffRule, defenderRule)
  @Get('case/:caseId/limitedAccess/courtRecord')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Gets the court record for an existing case as a pdf document',
  })
  async getCourtRecordPdf(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: TUser,
    @CurrentCase() theCase: Case,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.debug(
      `Getting the court record for case ${caseId} as a pdf document`,
    )

    const pdf = await this.pdfService.getCourtRecordPdf(theCase, user)

    res.end(pdf)
  }

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseReadGuard,
    CaseCompletedGuard,
  )
  @RolesRules(defenderRule)
  @Get('case/:caseId/limitedAccess/ruling')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Gets the ruling for an existing case as a pdf document',
  })
  async getRulingPdf(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.debug(`Getting the ruling for case ${caseId} as a pdf document`)

    const pdf = await this.pdfService.getRulingPdf(theCase)

    res.end(pdf)
  }

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard([CaseType.CUSTODY, CaseType.ADMISSION_TO_FACILITY]),
    CaseReadGuard,
    CaseCompletedGuard,
  )
  @RolesRules(prisonSystemStaffRule)
  @Get('case/:caseId/limitedAccess/custodyNotice')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description:
      'Gets custody notice for an existing custody case as a pdf document',
  })
  async getCustodyNoticePdf(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.debug(
      `Getting the custody notice for case ${caseId} as a pdf document`,
    )

    if (theCase.state !== CaseState.ACCEPTED) {
      throw new BadRequestException(
        `Cannot generate a custody notice for ${theCase.state} cases`,
      )
    }

    const pdf = await this.pdfService.getCustodyNoticePdf(theCase)

    res.end(pdf)
  }

  @UseGuards(
    JwtAuthGuard,
    CaseExistsGuard,
    RolesGuard,
    new CaseTypeGuard(indictmentCases),
    CaseReadGuard,
    MergedCaseExistsGuard,
  )
  @RolesRules(defenderGeneratedPdfRule)
  @Get([
    'case/:caseId/limitedAccess/indictment',
    'case/:caseId/limitedAccess/mergedCase/:mergedCaseId/indictment',
  ])
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Gets the indictment for an existing case as a pdf document',
  })
  async getIndictmentPdf(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.debug(
      `Getting the indictment for case ${caseId} as a pdf document`,
    )

    const pdf = await this.pdfService.getIndictmentPdf(theCase)

    res.end(pdf)
  }

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseReadGuard,
    CaseCompletedGuard,
  )
  @RolesRules(defenderRule)
  @Get('case/:caseId/limitedAccess/all')
  @Header('Content-Type', 'application/zip')
  @ApiOkResponse({
    content: { 'application/zip': {} },
    description: 'Gets the all files for an existing case as a zip document',
  })
  async getAllFilesZip(
    @CurrentCase() theCase: Case,
    @CurrentHttpUser() user: TUser,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.debug(
      `Getting all files for case ${theCase.id} as a zip document`,
    )

    const zip = await this.limitedAccessCaseService.getAllFilesZip(
      theCase,
      user,
    )

    res.end(zip)
  }
}
