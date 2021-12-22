import { Response } from 'express'

import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  ForbiddenException,
  Query,
  Res,
  Header,
  UseGuards,
  BadRequestException,
  HttpException,
  Inject,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  DokobitError,
  SigningServiceResponse,
} from '@island.is/dokobit-signing'
import { IntegratedCourts } from '@island.is/judicial-system/consts'
import {
  CaseState,
  CaseTransition,
  CaseType,
  isInvestigationCase,
  UserRole,
} from '@island.is/judicial-system/types'
import type { User } from '@island.is/judicial-system/types'
import {
  CurrentHttpUser,
  JwtAuthGuard,
  RolesRules,
  RolesGuard,
  RolesRule,
  RulesType,
  TokenGuard,
} from '@island.is/judicial-system/auth'

import {
  judgeRule,
  prosecutorRule,
  registrarRule,
  staffRule,
} from '../../guards'
import { UserService } from '../user'
import { CaseEvent, EventService } from '../event'
import {
  CaseExistsGuard,
  CaseReadGuard,
  CaseWriteGuard,
  CurrentCase,
} from './guards'
import {
  CreateCaseDto,
  InternalCreateCaseDto,
  TransitionCaseDto,
  UpdateCaseDto,
} from './dto'
import { Case, SignatureConfirmationResponse } from './models'
import { transitionCase } from './state'
import { CaseService } from './case.service'

// Allows prosecutors to update a specific set of fields
const prosecutorUpdateRule = {
  role: UserRole.PROSECUTOR,
  type: RulesType.FIELD,
  dtoFields: [
    'type',
    'description',
    'policeCaseNumber',
    'accusedNationalId',
    'accusedName',
    'accusedAddress',
    'accusedGender',
    'defenderName',
    'defenderEmail',
    'defenderPhoneNumber',
    'sendRequestToDefender',
    'isHeightenedSecurityLevel',
    'courtId',
    'leadInvestigator',
    'arrestDate',
    'requestedCourtDate',
    'translator',
    'requestedValidToDate',
    'demands',
    'lawsBroken',
    'legalBasis',
    'legalProvisions',
    'requestedCustodyRestrictions',
    'requestedOtherRestrictions',
    'caseFacts',
    'legalArguments',
    'requestProsecutorOnlySession',
    'prosecutorOnlySessionRequest',
    'comments',
    'caseFilesComments',
    'prosecutorId',
    'sharedWithProsecutorsOfficeId',
  ],
} as RolesRule

const courtFields = [
  'defenderName',
  'defenderEmail',
  'defenderPhoneNumber',
  'defenderIsSpokesperson',
  'courtCaseNumber',
  'sessionArrangements',
  'courtDate',
  'courtLocation',
  'courtRoom',
  'courtStartDate',
  'courtEndTime',
  'isClosedCourtHidden',
  'courtAttendees',
  'prosecutorDemands',
  'courtDocuments',
  'accusedBookings',
  'litigationPresentations',
  'courtCaseFacts',
  'courtLegalArguments',
  'ruling',
  'decision',
  'validToDate',
  'custodyRestrictions',
  'otherRestrictions',
  'isolationToDate',
  'conclusion',
  'accusedAppealDecision',
  'accusedAppealAnnouncement',
  'prosecutorAppealDecision',
  'prosecutorAppealAnnouncement',
  'accusedPostponedAppealDate',
  'prosecutorPostponedAppealDate',
  'judgeId',
  'registrarId',
]

// Allows judges to update a specific set of fields
const judgeUpdateRule = {
  role: UserRole.JUDGE,
  type: RulesType.FIELD,
  dtoFields: courtFields,
} as RolesRule

// Allows registrars to update a specific set of fields
const registrarUpdateRule = {
  role: UserRole.REGISTRAR,
  type: RulesType.FIELD,
  dtoFields: courtFields,
} as RolesRule

// Allows prosecutors to open, submit and delete cases
const prosecutorTransitionRule = {
  role: UserRole.PROSECUTOR,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [
    CaseTransition.OPEN,
    CaseTransition.SUBMIT,
    CaseTransition.DELETE,
  ],
} as RolesRule

// Allows judges to receive, accept and reject cases
const judgeTransitionRule = {
  role: UserRole.JUDGE,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [
    CaseTransition.RECEIVE,
    CaseTransition.ACCEPT,
    CaseTransition.REJECT,
    CaseTransition.DISMISS,
  ],
} as RolesRule

// Allows registrars to receive cases
const registrarTransitionRule = {
  role: UserRole.REGISTRAR,
  type: RulesType.FIELD_VALUES,
  dtoField: 'transition',
  dtoFieldValues: [CaseTransition.RECEIVE],
} as RolesRule

@Controller('api')
@ApiTags('cases')
export class CaseController {
  constructor(
    private readonly caseService: CaseService,
    private readonly userService: UserService,
    private readonly eventService: EventService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private async validateAssignedUser(
    assignedUserId: string,
    assignedUserRole: UserRole,
    institutionId: string | undefined,
  ) {
    const assignedUser = await this.userService.findById(assignedUserId)

    if (!assignedUser) {
      throw new NotFoundException(`User ${assignedUserId} does not exist`)
    }

    if (assignedUser.role !== assignedUserRole) {
      throw new ForbiddenException(
        `User ${assignedUserId} is not a ${assignedUserRole}}`,
      )
    }

    if (institutionId && assignedUser.institutionId !== institutionId) {
      throw new ForbiddenException(
        `User ${assignedUserId} belongs to the wrong institution`,
      )
    }
  }

  @UseGuards(TokenGuard)
  @Post('internal/case')
  @ApiCreatedResponse({ type: Case, description: 'Creates a new case' })
  async internalCreate(
    @Body() caseToCreate: InternalCreateCaseDto,
  ): Promise<Case> {
    this.logger.debug('Creating a new case')

    const createdCase = await this.caseService.internalCreate(caseToCreate)

    this.eventService.postEvent(CaseEvent.CREATE_XRD, createdCase as Case)

    return createdCase
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(prosecutorRule)
  @Post('case')
  @ApiCreatedResponse({ type: Case, description: 'Creates a new case' })
  async create(
    @CurrentHttpUser() user: User,
    @Body() caseToCreate: CreateCaseDto,
  ): Promise<Case> {
    this.logger.debug('Creating a new case')

    const createdCase = await this.caseService.create(caseToCreate, user.id)

    this.eventService.postEvent(CaseEvent.CREATE, createdCase as Case)

    return createdCase
  }

  @UseGuards(JwtAuthGuard, RolesGuard, CaseExistsGuard, CaseWriteGuard)
  @RolesRules(prosecutorUpdateRule, judgeUpdateRule, registrarUpdateRule)
  @Put('case/:caseId')
  @ApiOkResponse({ type: Case, description: 'Updates an existing case' })
  async update(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @Body() caseToUpdate: UpdateCaseDto,
  ): Promise<Case | null> {
    this.logger.debug(`Updating case ${caseId}`)

    // Make sure valid users are assigned to the case's roles
    if (caseToUpdate.prosecutorId) {
      await this.validateAssignedUser(
        caseToUpdate.prosecutorId,
        UserRole.PROSECUTOR,
        theCase.creatingProsecutor?.institutionId,
      )

      // If the case was created via xRoad, then there is no creating prosecutor
      if (!theCase.creatingProsecutor) {
        caseToUpdate = {
          ...caseToUpdate,
          creatingProsecutorId: caseToUpdate.prosecutorId,
        } as UpdateCaseDto
      }
    }

    if (caseToUpdate.judgeId) {
      await this.validateAssignedUser(
        caseToUpdate.judgeId,
        UserRole.JUDGE,
        theCase.courtId,
      )
    }

    if (caseToUpdate.registrarId) {
      await this.validateAssignedUser(
        caseToUpdate.registrarId,
        UserRole.REGISTRAR,
        theCase.courtId,
      )
    }

    const updatedCase = await this.caseService.update(caseId, caseToUpdate)

    if (
      theCase.courtId &&
      IntegratedCourts.includes(theCase.courtId) &&
      Boolean(caseToUpdate.courtCaseNumber) &&
      caseToUpdate.courtCaseNumber !== theCase.courtCaseNumber
    ) {
      // TODO: Find a better place for this
      // No need to wait for the upload
      this.caseService.uploadRequestPdfToCourt(updatedCase as Case)
    }

    return updatedCase
  }

  @UseGuards(JwtAuthGuard, RolesGuard, CaseExistsGuard, CaseWriteGuard)
  @RolesRules(
    prosecutorTransitionRule,
    judgeTransitionRule,
    registrarTransitionRule,
  )
  @Put('case/:caseId/state')
  @ApiOkResponse({
    type: Case,
    description: 'Transitions an existing case to a new state',
  })
  async transition(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() _0: User,
    @CurrentCase() theCase: Case,
    @Body() transition: TransitionCaseDto,
  ): Promise<Case | null> {
    this.logger.debug(`Transitioning case ${caseId}`)

    // Use existingCase.modified when client is ready to send last modified timestamp with all updates
    const state = transitionCase(transition.transition, theCase.state)

    // TODO: UpdateCaseDto does not contain state - create a new type for CaseService.update
    const update: { state: CaseState; parentCaseId?: null } = { state }

    if (state === CaseState.DELETED) {
      update.parentCaseId = null
    }

    const updatedCase = await this.caseService.update(
      caseId,
      update as UpdateCaseDto,
    )

    this.eventService.postEvent(
      (transition.transition as unknown) as CaseEvent,
      updatedCase as Case,
    )

    return updatedCase
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(prosecutorRule, judgeRule, registrarRule, staffRule)
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

  @UseGuards(JwtAuthGuard, RolesGuard, CaseExistsGuard, CaseReadGuard)
  @RolesRules(prosecutorRule, judgeRule, registrarRule, staffRule)
  @Get('case/:caseId')
  @ApiOkResponse({ type: Case, description: 'Gets an existing case' })
  getById(@Param('caseId') caseId: string, @CurrentCase() theCase: Case): Case {
    this.logger.debug(`Getting case ${caseId} by id`)

    return theCase
  }

  @UseGuards(JwtAuthGuard, RolesGuard, CaseExistsGuard, CaseReadGuard)
  @RolesRules(prosecutorRule, judgeRule, registrarRule)
  @Get('case/:caseId/request')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Gets the request for an existing case as a pdf document',
  })
  async getRequestPdf(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.debug(
      `Getting the request for case ${caseId} as a pdf document`,
    )

    if (
      isInvestigationCase(theCase.type) &&
      ((user.role === UserRole.JUDGE && user.id !== theCase.judge?.id) ||
        (user.role === UserRole.REGISTRAR && user.id !== theCase.registrar?.id))
    ) {
      throw new ForbiddenException(
        'Only the assigned judge and registrar can get the request pdf for investigation cases',
      )
    }

    const pdf = await this.caseService.getRequestPdf(theCase)

    return res.end(pdf)
  }

  @UseGuards(JwtAuthGuard, RolesGuard, CaseExistsGuard, CaseReadGuard)
  @RolesRules(prosecutorRule, judgeRule, registrarRule, staffRule)
  @Get('case/:caseId/courtRecord')
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

    if (
      isInvestigationCase(theCase.type) &&
      ((user.role === UserRole.JUDGE && user.id !== theCase.judge?.id) ||
        (user.role === UserRole.REGISTRAR && user.id !== theCase.registrar?.id))
    ) {
      throw new ForbiddenException(
        'Only the assigned judge and registrar can get the court record pdf for investigation cases',
      )
    }

    const pdf = await this.caseService.getCourtRecordPdf(theCase)

    return res.end(pdf)
  }

  @UseGuards(JwtAuthGuard, RolesGuard, CaseExistsGuard, CaseReadGuard)
  @RolesRules(prosecutorRule, judgeRule, registrarRule, staffRule)
  @Get('case/:caseId/ruling')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Gets the ruling for an existing case as a pdf document',
  })
  async getRulingPdf(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.debug(`Getting the ruling for case ${caseId} as a pdf document`)

    if (
      isInvestigationCase(theCase.type) &&
      ((user.role === UserRole.JUDGE && user.id !== theCase.judge?.id) ||
        (user.role === UserRole.REGISTRAR && user.id !== theCase.registrar?.id))
    ) {
      throw new ForbiddenException(
        'Only the assigned judge and registrar can get the ruling pdf for investigation cases',
      )
    }

    const pdf = await this.caseService.getRulingPdf(theCase)

    return res.end(pdf)
  }

  @UseGuards(JwtAuthGuard, RolesGuard, CaseExistsGuard, CaseReadGuard)
  @RolesRules(prosecutorRule, judgeRule, registrarRule, staffRule)
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

    if (theCase.type !== CaseType.CUSTODY) {
      throw new BadRequestException(
        `Cannot generate a custody notice for ${theCase.type} cases`,
      )
    }

    if (theCase.state !== CaseState.ACCEPTED) {
      throw new BadRequestException(
        `Cannot generate a custody notice for ${theCase.state} cases`,
      )
    }

    const pdf = await this.caseService.getCustodyPdf(theCase)

    return res.end(pdf)
  }

  @UseGuards(JwtAuthGuard, RolesGuard, CaseExistsGuard, CaseWriteGuard)
  @RolesRules(judgeRule, registrarRule)
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

    if (user.id !== theCase.judgeId && user.id !== theCase.registrarId) {
      throw new ForbiddenException(
        'A court record must be signed by the assigned judge or registrar',
      )
    }

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

  @UseGuards(JwtAuthGuard, RolesGuard, CaseExistsGuard, CaseWriteGuard)
  @RolesRules(judgeRule, registrarRule)
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

    if (user.id !== theCase.judgeId && user.id !== theCase.registrarId) {
      throw new ForbiddenException(
        'A court record must be signed by the assigned judge or registrar',
      )
    }

    return this.caseService.getCourtRecordSignatureConfirmation(
      theCase,
      user,
      documentToken,
    )
  }

  @UseGuards(JwtAuthGuard, RolesGuard, CaseExistsGuard, CaseWriteGuard)
  @RolesRules(judgeRule)
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

    if (user.id !== theCase.judgeId) {
      throw new ForbiddenException(
        'A ruling must be signed by the assigned judge',
      )
    }

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

  @UseGuards(JwtAuthGuard, RolesGuard, CaseExistsGuard, CaseWriteGuard)
  @RolesRules(judgeRule)
  @Get('case/:caseId/ruling/signature')
  @ApiOkResponse({
    type: SignatureConfirmationResponse,
    description:
      'Confirms a previously requested ruling signature for an existing case',
  })
  getRulingSignatureConfirmation(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @Query('documentToken') documentToken: string,
  ): Promise<SignatureConfirmationResponse> {
    this.logger.debug(`Confirming a signature for the ruling of case ${caseId}`)

    if (user.id !== theCase.judgeId) {
      throw new ForbiddenException(
        'A ruling must be signed by the assigned judge',
      )
    }

    return this.caseService.getRulingSignatureConfirmation(
      theCase,
      documentToken,
    )
  }

  @UseGuards(JwtAuthGuard, RolesGuard, CaseExistsGuard, CaseReadGuard)
  @RolesRules(prosecutorRule)
  @Post('case/:caseId/extend')
  @ApiCreatedResponse({
    type: Case,
    description: 'Clones a new case based on an existing case',
  })
  async extend(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
  ): Promise<Case | null> {
    this.logger.debug(`Extending case ${caseId}`)

    if (theCase.childCase) {
      return theCase.childCase
    }

    const extendedCase = await this.caseService.extend(theCase, user)

    this.eventService.postEvent(CaseEvent.EXTEND, extendedCase as Case)

    return extendedCase
  }
}
