import { Response } from 'express'

import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Header,
  HttpException,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import {
  DokobitError,
  SigningServiceResponse,
} from '@island.is/dokobit-signing'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  CurrentHttpUser,
  JwtAuthUserGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import {
  capitalize,
  formatDate,
  lowercase,
} from '@island.is/judicial-system/formatters'
import type { User } from '@island.is/judicial-system/types'
import {
  CaseOrigin,
  CaseState,
  CaseType,
  hasGeneratedCourtRecordPdf,
  indictmentCases,
  investigationCases,
  isPublicProsecutionOfficeUser,
  isRequestCase,
  restrictionCases,
  UserRole,
} from '@island.is/judicial-system/types'

import { nowFactory } from '../../factories'
import {
  courtOfAppealsAssistantRule,
  courtOfAppealsJudgeRule,
  courtOfAppealsRegistrarRule,
  defenderRule,
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  prosecutorRepresentativeRule,
  prosecutorRule,
  publicProsecutorStaffRule,
} from '../../guards'
import { CivilClaimantService } from '../defendant'
import { EventService } from '../event'
import { Case } from '../repository'
import { UpdateCase } from '../repository'
import { UserService } from '../user'
import { CreateCaseDto } from './dto/createCase.dto'
import { TransitionCaseDto } from './dto/transitionCase.dto'
import { UpdateCaseDto } from './dto/updateCase.dto'
import { CurrentCase } from './guards/case.decorator'
import { CaseCompletedGuard } from './guards/caseCompleted.guard'
import { CaseExistsGuard } from './guards/caseExists.guard'
import { CaseReadGuard } from './guards/caseRead.guard'
import { CaseTransitionGuard } from './guards/caseTransition.guard'
import { CaseTypeGuard } from './guards/caseType.guard'
import { CaseWriteGuard } from './guards/caseWrite.guard'
import { MergedCaseExistsGuard } from './guards/mergedCaseExists.guard'
import {
  courtOfAppealsAssistantTransitionRule,
  courtOfAppealsAssistantUpdateRule,
  courtOfAppealsJudgeTransitionRule,
  courtOfAppealsJudgeUpdateRule,
  courtOfAppealsRegistrarTransitionRule,
  courtOfAppealsRegistrarUpdateRule,
  districtCourtAssistantTransitionRule,
  districtCourtAssistantUpdateRule,
  districtCourtJudgeSignRulingRule,
  districtCourtJudgeTransitionRule,
  districtCourtJudgeUpdateRule,
  districtCourtRegistrarTransitionRule,
  districtCourtRegistrarUpdateRule,
  prosecutorRepresentativeTransitionRule,
  prosecutorRepresentativeUpdateRule,
  prosecutorTransitionRule,
  prosecutorUpdateRule,
  publicProsecutorStaffUpdateRule,
} from './guards/rolesRules'
import {
  CaseInterceptor,
  CasesInterceptor,
} from './interceptors/case.interceptor'
import { CaseListInterceptor } from './interceptors/caseList.interceptor'
import { CompletedAppealAccessedInterceptor } from './interceptors/completedAppealAccessed.interceptor'
import { SignatureConfirmationResponse } from './models/signatureConfirmation.response'
import { transitionCase } from './state/case.state'
import { CaseService } from './case.service'
import { PdfService } from './pdf.service'

@Controller('api')
@ApiTags('cases')
export class CaseController {
  constructor(
    private readonly caseService: CaseService,
    private readonly userService: UserService,
    private readonly eventService: EventService,
    private readonly pdfService: PdfService,
    private readonly civilClaimantService: CivilClaimantService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private async validateAssignedUser(
    assignedUserId: string,
    assignableUserRoles: UserRole[],
    institutionId?: string,
  ) {
    const assignedUser = await this.userService.findById(assignedUserId)

    if (!assignableUserRoles.includes(assignedUser.role)) {
      throw new ForbiddenException(
        `User ${assignedUserId} does not have an acceptable role ${assignableUserRoles}}`,
      )
    }

    if (institutionId && assignedUser.institutionId !== institutionId) {
      throw new ForbiddenException(
        `User ${assignedUserId} belongs to the wrong institution`,
      )
    }
  }

  @UseGuards(JwtAuthUserGuard, RolesGuard)
  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @UseInterceptors(CaseInterceptor)
  @Post('case')
  @ApiCreatedResponse({ type: Case, description: 'Creates a new case' })
  async create(
    @CurrentHttpUser() user: User,
    @Body() caseToCreate: CreateCaseDto,
  ): Promise<Case> {
    this.logger.debug('Creating a new case')

    const createdCase = await this.caseService.create(caseToCreate, user)

    this.eventService.postEvent('CREATE', createdCase)

    return createdCase
  }

  @UseGuards(JwtAuthUserGuard, RolesGuard, CaseExistsGuard, CaseWriteGuard)
  @RolesRules(
    prosecutorUpdateRule,
    prosecutorRepresentativeUpdateRule,
    districtCourtJudgeUpdateRule,
    districtCourtRegistrarUpdateRule,
    districtCourtAssistantUpdateRule,
    courtOfAppealsJudgeUpdateRule,
    courtOfAppealsRegistrarUpdateRule,
    courtOfAppealsAssistantUpdateRule,
    publicProsecutorStaffUpdateRule,
  )
  @UseInterceptors(CaseInterceptor)
  @Patch('case/:caseId')
  @ApiOkResponse({ type: Case, description: 'Updates an existing case' })
  async update(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @Body() updateDto: UpdateCaseDto,
  ): Promise<Case> {
    this.logger.debug(`Updating case ${caseId}`)

    const update: UpdateCase = updateDto

    // Make sure valid users are assigned to the case's roles
    if (update.prosecutorId) {
      await this.validateAssignedUser(
        update.prosecutorId,
        [UserRole.PROSECUTOR],
        theCase.prosecutorsOfficeId,
      )
    }

    if (update.judgeId) {
      await this.validateAssignedUser(
        update.judgeId,
        [UserRole.DISTRICT_COURT_JUDGE, UserRole.DISTRICT_COURT_ASSISTANT],
        theCase.courtId,
      )
    }

    if (update.registrarId) {
      await this.validateAssignedUser(
        update.registrarId,
        [UserRole.DISTRICT_COURT_REGISTRAR, UserRole.DISTRICT_COURT_ASSISTANT],
        theCase.courtId,
      )
    }

    if (update.appealAssistantId) {
      await this.validateAssignedUser(update.appealAssistantId, [
        UserRole.COURT_OF_APPEALS_ASSISTANT,
      ])
    }

    if (update.appealJudge1Id) {
      await this.validateAssignedUser(update.appealJudge1Id, [
        UserRole.COURT_OF_APPEALS_JUDGE,
      ])
    }

    if (update.appealJudge2Id) {
      await this.validateAssignedUser(update.appealJudge2Id, [
        UserRole.COURT_OF_APPEALS_JUDGE,
      ])
    }

    if (update.appealJudge3Id) {
      await this.validateAssignedUser(update.appealJudge3Id, [
        UserRole.COURT_OF_APPEALS_JUDGE,
      ])
    }

    if (update.rulingModifiedHistory) {
      const history = theCase.rulingModifiedHistory
        ? `${theCase.rulingModifiedHistory}\n\n`
        : ''
      const today = capitalize(formatDate(nowFactory(), 'PPPPp'))
      update.rulingModifiedHistory = `${history}${today} - ${
        user.name
      } ${lowercase(user.title)}\n\n${update.rulingModifiedHistory}`
    }

    if (update.caseResentExplanation) {
      // We want to overwrite certain fields that the court sees so they're always seeing
      // the correct information post resend
      update.courtCaseFacts = `Í greinargerð sóknaraðila er atvikum lýst svo: ${theCase.caseFacts}`
      update.courtLegalArguments = `Í greinargerð er krafa sóknaraðila rökstudd þannig: ${theCase.legalArguments}`
      update.prosecutorDemands = update.demands ?? theCase.demands
      if (!theCase.decision) {
        update.validToDate =
          update.requestedValidToDate ?? theCase.requestedValidToDate
      }
    }

    if (update.prosecutorStatementDate) {
      update.prosecutorStatementDate = nowFactory()
    }

    if (update.appealRulingModifiedHistory) {
      const history = theCase.appealRulingModifiedHistory
        ? `${theCase.appealRulingModifiedHistory}\n\n`
        : ''
      const today = capitalize(formatDate(nowFactory(), 'PPPPp'))
      update.appealRulingModifiedHistory = `${history}${today} - ${
        user.name
      } ${lowercase(user.title)}\n\n${update.appealRulingModifiedHistory}`
    }

    if (update.mergeCaseId && theCase.state !== CaseState.RECEIVED) {
      throw new BadRequestException(
        'Cannot merge case that is not in a received state',
      )
    }

    if (update.hasCivilClaims !== undefined) {
      if (update.hasCivilClaims) {
        await this.civilClaimantService.create(theCase)
      } else {
        await this.civilClaimantService.deleteAll(theCase.id)
      }
    }

    // If the case comes from LOKE then we don't want to allow the removal or
    // moving around of the first police case number as that coupled with the
    // case id is the identifier used to update the case in LOKE.
    if (theCase.origin === CaseOrigin.LOKE && update.policeCaseNumbers) {
      const mainPoliceCaseNumber = theCase.policeCaseNumbers[0]

      if (
        mainPoliceCaseNumber &&
        update.policeCaseNumbers?.indexOf(mainPoliceCaseNumber) !== 0
      ) {
        throw new BadRequestException(
          `Cannot remove or move main police case number ${mainPoliceCaseNumber}`,
        )
      }
    }

    return this.caseService.update(theCase, update, user) as Promise<Case> // Never returns undefined
  }

  @UseGuards(
    JwtAuthUserGuard,
    CaseExistsGuard,
    RolesGuard,
    CaseWriteGuard,
    CaseTransitionGuard,
  )
  @RolesRules(
    prosecutorTransitionRule,
    prosecutorRepresentativeTransitionRule,
    districtCourtJudgeTransitionRule,
    districtCourtRegistrarTransitionRule,
    districtCourtAssistantTransitionRule,
    courtOfAppealsJudgeTransitionRule,
    courtOfAppealsRegistrarTransitionRule,
    courtOfAppealsAssistantTransitionRule,
  )
  @UseInterceptors(CaseInterceptor)
  @Patch('case/:caseId/state')
  @ApiOkResponse({
    type: Case,
    description: 'Transitions an existing case to a new state',
  })
  async transition(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @Body() transition: TransitionCaseDto,
  ): Promise<Case> {
    this.logger.debug(`Transitioning case ${caseId}`)

    const update = transitionCase(transition.transition, theCase, user)

    const updatedCase = await this.caseService.update(
      theCase,
      update,
      user,
      update.state !== CaseState.DELETED,
    )

    // No need to wait
    this.eventService.postEvent(transition.transition, updatedCase ?? theCase)

    return updatedCase ?? theCase
  }

  @UseGuards(JwtAuthUserGuard, RolesGuard)
  @RolesRules(defenderRule)
  @UseInterceptors(CaseListInterceptor)
  @Get('cases')
  @ApiOkResponse({
    type: Case,
    isArray: true,
    description: 'Gets all existing cases',
  })
  getAll(@CurrentHttpUser() user: User): Promise<Case[]> {
    this.logger.debug('Getting all cases')

    return this.caseService.getAll(user)
  }

  @UseGuards(JwtAuthUserGuard, RolesGuard, CaseExistsGuard, CaseReadGuard)
  @RolesRules(
    prosecutorRule,
    prosecutorRepresentativeRule,
    publicProsecutorStaffRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
    courtOfAppealsJudgeRule,
    courtOfAppealsRegistrarRule,
    courtOfAppealsAssistantRule,
  )
  @UseInterceptors(CompletedAppealAccessedInterceptor, CaseInterceptor)
  @Get('case/:caseId')
  @ApiOkResponse({ type: Case, description: 'Gets an existing case by id' })
  getById(@Param('caseId') caseId: string, @CurrentCase() theCase: Case): Case {
    this.logger.debug(`Getting case ${caseId} by id`)

    return theCase
  }

  @UseGuards(JwtAuthUserGuard, CaseExistsGuard)
  @RolesRules(
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @UseInterceptors(CasesInterceptor)
  @Get('case/:caseId/connectedCases')
  @ApiOkResponse({ type: [Case], description: 'Gets all connected cases' })
  async getConnectedCases(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
  ): Promise<Case[]> {
    this.logger.debug(`Getting connected cases for case ${caseId}`)

    if (!theCase.defendants || theCase.defendants.length === 0) {
      return []
    }

    const connectedCases = await Promise.all(
      theCase.defendants.map((defendant) =>
        this.caseService.getConnectedIndictmentCases(theCase.id, defendant),
      ),
    )

    return connectedCases.flat()
  }

  @UseGuards(
    JwtAuthUserGuard,
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseReadGuard,
  )
  @RolesRules(
    prosecutorRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
    courtOfAppealsJudgeRule,
    courtOfAppealsRegistrarRule,
    courtOfAppealsAssistantRule,
  )
  @Get('case/:caseId/request')
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
    JwtAuthUserGuard,
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    CaseReadGuard,
    MergedCaseExistsGuard,
  )
  @RolesRules(
    prosecutorRule,
    prosecutorRepresentativeRule,
    publicProsecutorStaffRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Get([
    'case/:caseId/caseFilesRecord/:policeCaseNumber',
    'case/:caseId/mergedCase/:mergedCaseId/caseFilesRecord/:policeCaseNumber',
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
    JwtAuthUserGuard,
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard([
      ...restrictionCases,
      ...investigationCases,
      ...indictmentCases,
    ]),
    CaseReadGuard,
    MergedCaseExistsGuard,
  )
  @RolesRules(
    prosecutorRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
    courtOfAppealsJudgeRule,
    courtOfAppealsRegistrarRule,
    courtOfAppealsAssistantRule,
    publicProsecutorStaffRule,
  )
  @Get([
    'case/:caseId/courtRecord',
    'case/:caseId/mergedCase/:mergedCaseId/courtRecord',
  ])
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Gets the court record for an existing case as a pdf document',
  })
  async getCourtRecordPdf(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.debug(
      `Getting the court record for case ${caseId} as a pdf document`,
    )

    let pdf: Buffer

    if (isRequestCase(theCase.type)) {
      if (isPublicProsecutionOfficeUser(user)) {
        throw new ForbiddenException(
          'Public prosecution office users are not allowed to get court record pdfs for request cases',
        )
      }

      pdf = await this.pdfService.getCourtRecordPdf(theCase, user)
    } else {
      if (
        !hasGeneratedCourtRecordPdf(
          theCase.state,
          theCase.indictmentRulingDecision,
          theCase.withCourtSessions,
          theCase.courtSessions,
          user,
        )
      ) {
        throw new BadRequestException(
          `Case ${caseId} does not have a generated court record pdf document`,
        )
      }

      pdf = await this.pdfService.getCourtRecordPdfForIndictmentCase(
        theCase,
        user,
      )
    }

    res.end(pdf)
  }

  @UseGuards(
    JwtAuthUserGuard,
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseReadGuard,
  )
  @RolesRules(
    prosecutorRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
    courtOfAppealsJudgeRule,
    courtOfAppealsRegistrarRule,
    courtOfAppealsAssistantRule,
  )
  @Get('case/:caseId/ruling')
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
    JwtAuthUserGuard,
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard([CaseType.CUSTODY, CaseType.ADMISSION_TO_FACILITY]),
    CaseReadGuard,
    CaseCompletedGuard,
  )
  @RolesRules(
    prosecutorRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Get('case/:caseId/custodyNotice')
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
    JwtAuthUserGuard,
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    CaseReadGuard,
    MergedCaseExistsGuard,
  )
  @RolesRules(
    prosecutorRule,
    prosecutorRepresentativeRule,
    publicProsecutorStaffRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Get([
    'case/:caseId/indictment',
    'case/:caseId/mergedCase/:mergedCaseId/indictment',
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
    JwtAuthUserGuard,
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    CaseReadGuard,
  )
  @RolesRules(publicProsecutorStaffRule)
  @Get('case/:caseId/rulingSentToPrisonAdmin')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description:
      'Gets the ruling sent to prison admin file for an existing case as a pdf document',
  })
  async getRulingSentToPrisonAdminPdf(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.debug(
      `Getting the ruling sent to prison admin pdf for indictment case ${caseId} as a pdf document`,
    )

    // TODO: Clarity on if/when we should prevent this PDF from being created
    // Like if certain defendants aren't in the right state in terms of
    // being sent to prison admin. To start with lets assume we surely
    // don't want to make this PDF if none of the defendants have been
    // sent to the prison admin.
    const isSentToPrisonAdmin = theCase.defendants?.some(
      (defendant) => defendant.isSentToPrisonAdmin,
    )

    if (!isSentToPrisonAdmin) {
      throw new BadRequestException(
        `Cannot generate a ruling sent to prison admin pdf for case ${caseId} as none of the defendants have been sent to prison admin
        `,
      )
    }

    const pdf = await this.pdfService.getRulingSentToPrisonAdminPdf(theCase)

    res.end(pdf)
  }

  @UseGuards(
    JwtAuthUserGuard,
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseWriteGuard,
  )
  @RolesRules(
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Post('case/:caseId/courtRecord/signature')
  @ApiCreatedResponse({
    type: SigningServiceResponse,
    description: 'Requests a court record signature for an existing case',
  })
  async requestCourtRecordSignature(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
  ): Promise<SigningServiceResponse> {
    this.logger.debug(
      `Requesting a signature for the court record of case ${caseId}`,
    )

    return this.caseService
      .requestCourtRecordSignature(theCase, user)
      .catch((error) => {
        if (error instanceof DokobitError) {
          throw new HttpException(
            {
              statusCode: error.status,
              message: `Failed to request a court record signature for case ${caseId}`,
              code: error.code,
              error: error.message,
            },
            error.status,
          )
        }

        throw error
      })
  }

  @UseGuards(
    JwtAuthUserGuard,
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseWriteGuard,
  )
  @RolesRules(
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Get('case/:caseId/courtRecord/signature')
  @ApiOkResponse({
    type: SignatureConfirmationResponse,
    description:
      'Confirms a previously requested court record signature for an existing case',
  })
  getCourtRecordSignatureConfirmation(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @Query('documentToken') documentToken: string,
  ): Promise<SignatureConfirmationResponse> {
    this.logger.debug(
      `Confirming a signature for the court record of case ${caseId}`,
    )

    return this.caseService.getCourtRecordSignatureConfirmation(
      theCase,
      user,
      documentToken,
    )
  }

  @UseGuards(
    JwtAuthUserGuard,
    CaseExistsGuard,
    RolesGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseWriteGuard,
  )
  @RolesRules(districtCourtJudgeSignRulingRule)
  @Post('case/:caseId/ruling/signature')
  @ApiCreatedResponse({
    type: SigningServiceResponse,
    description: 'Requests a ruling signature for an existing case',
  })
  async requestRulingSignature(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
  ): Promise<SigningServiceResponse> {
    this.logger.debug(`Requesting a signature for the ruling of case ${caseId}`)

    return this.caseService.requestRulingSignature(theCase).catch((error) => {
      if (error instanceof DokobitError) {
        throw new HttpException(
          {
            statusCode: error.status,
            message: `Failed to request a ruling signature for case ${caseId}`,
            code: error.code,
            error: error.message,
          },
          error.status,
        )
      }

      throw error
    })
  }

  @UseGuards(
    JwtAuthUserGuard,
    CaseExistsGuard,
    RolesGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseWriteGuard,
  )
  @RolesRules(districtCourtJudgeSignRulingRule)
  @Get('case/:caseId/ruling/signature')
  @ApiOkResponse({
    type: SignatureConfirmationResponse,
    description:
      'Confirms a previously requested ruling signature for an existing case',
  })
  async getRulingSignatureConfirmation(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @Query('documentToken') documentToken: string,
  ): Promise<SignatureConfirmationResponse> {
    this.logger.debug(`Confirming a signature for the ruling of case ${caseId}`)

    return this.caseService.getRulingSignatureConfirmation(
      theCase,
      user,
      documentToken,
    )
  }

  @UseGuards(
    JwtAuthUserGuard,
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseReadGuard,
  )
  @RolesRules(prosecutorRule)
  @UseInterceptors(CaseInterceptor)
  @Post('case/:caseId/extend')
  @ApiCreatedResponse({
    type: Case,
    description: 'Clones a new case based on an existing case',
  })
  async extend(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
  ): Promise<Case> {
    this.logger.debug(`Extending case ${caseId}`)

    if (theCase.childCase) {
      return theCase.childCase
    }

    const extendedCase = await this.caseService.extend(theCase, user)

    this.eventService.postEvent('EXTEND', extendedCase as Case)

    return extendedCase
  }

  @UseGuards(JwtAuthUserGuard, RolesGuard, CaseExistsGuard, CaseWriteGuard)
  @RolesRules(
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @UseInterceptors(CaseInterceptor)
  @Post('case/:caseId/court')
  @ApiCreatedResponse({
    type: Case,
    description: 'Creates a court case associated with an existing case',
  })
  async createCourtCase(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
  ): Promise<Case> {
    this.logger.debug(`Creating a court case for case ${caseId}`)

    return this.caseService.createCourtCase(theCase, user)
  }
}
