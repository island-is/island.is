import { ReadableStreamBuffer } from 'stream-buffers'
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
  ConflictException,
  Res,
  Header,
  UseGuards,
  BadRequestException,
  ParseBoolPipe,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

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
import { CreateCaseDto, TransitionCaseDto, UpdateCaseDto } from './dto'
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
    @Body() caseToCreate: CreateCaseDto,
  ): Promise<Case | null> {
    const createdCase = await this.caseService.create(caseToCreate)

    const resCase = await this.caseService.findById(createdCase.id)

    this.eventService.postEvent(CaseEvent.CREATE_XRD, resCase as Case)

    return resCase
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(prosecutorRule)
  @Post('case')
  @ApiCreatedResponse({ type: Case, description: 'Creates a new case' })
  async create(
    @CurrentHttpUser() user: User,
    @Body() caseToCreate: CreateCaseDto,
  ): Promise<Case | null> {
    const createdCase = await this.caseService.create(caseToCreate, user)

    const resCase = await this.caseService.findById(createdCase.id)

    this.eventService.postEvent(CaseEvent.CREATE, resCase as Case)

    return resCase
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

    const { numberOfAffectedRows, updatedCase } = await this.caseService.update(
      caseId,
      caseToUpdate,
    )

    if (numberOfAffectedRows === 0) {
      // TODO: Find a more suitable exception to throw
      throw new NotFoundException(`Case ${caseId} does not exist`)
    }

    if (
      theCase.courtId &&
      IntegratedCourts.includes(theCase.courtId) &&
      Boolean(caseToUpdate.courtCaseNumber) &&
      caseToUpdate.courtCaseNumber !== theCase.courtCaseNumber
    ) {
      // TODO: Find a better place for this
      // No need to wait for the upload
      this.caseService.uploadRequestPdfToCourt(caseId)
    }

    return this.caseService.findById(updatedCase.id)
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
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @Body() transition: TransitionCaseDto,
  ): Promise<Case | null> {
    // Use existingCase.modified when client is ready to send last modified timestamp with all updates
    const state = transitionCase(transition.transition, theCase.state)

    // TODO: UpdateCaseDto does not contain state - create a new type for CaseService.update
    const update: { state: CaseState; parentCaseId?: null } = { state }

    if (state === CaseState.DELETED) {
      update.parentCaseId = null
    }

    const { numberOfAffectedRows, updatedCase } = await this.caseService.update(
      caseId,
      update as UpdateCaseDto,
    )

    if (numberOfAffectedRows === 0) {
      throw new ConflictException(
        `A more recent version exists of the case with id ${caseId}`,
      )
    }

    const resCase = await this.caseService.findById(updatedCase.id)

    this.eventService.postEvent(
      (transition.transition as unknown) as CaseEvent,
      resCase as Case,
    )

    return resCase
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
    return this.caseService.getAll(user)
  }

  @UseGuards(JwtAuthGuard, RolesGuard, CaseExistsGuard, CaseReadGuard)
  @RolesRules(prosecutorRule, judgeRule, registrarRule, staffRule)
  @Get('case/:caseId')
  @ApiOkResponse({ type: Case, description: 'Gets an existing case' })
  getById(@Param('caseId') _0: string, @CurrentCase() theCase: Case): Case {
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
    @Param('caseId') _0: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @Res() res: Response,
  ) {
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

    const stream = new ReadableStreamBuffer({
      frequency: 10,
      chunkSize: 2048,
    })
    stream.put(pdf, 'binary')

    res.header('Content-length', pdf.length.toString())

    return stream.pipe(res)
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
    @Param('caseId') _0: string,
    @Query('shortVersion', ParseBoolPipe) shortVersion: boolean,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @Res() res: Response,
  ) {
    if (
      isInvestigationCase(theCase.type) &&
      ((user.role === UserRole.JUDGE && user.id !== theCase.judge?.id) ||
        (user.role === UserRole.REGISTRAR && user.id !== theCase.registrar?.id))
    ) {
      throw new ForbiddenException(
        'Only the assigned judge and registrar can get the ruling pdf for investigation cases',
      )
    }

    const pdf = await this.caseService.getRulingPdf(theCase, shortVersion)

    const stream = new ReadableStreamBuffer({
      frequency: 10,
      chunkSize: 2048,
    })
    stream.put(pdf, 'binary')

    res.header('Content-length', pdf.length.toString())

    return stream.pipe(res)
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
    @Param('caseId') _0: string,
    @CurrentCase() theCase: Case,
    @Res() res: Response,
  ) {
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

    const stream = new ReadableStreamBuffer({
      frequency: 10,
      chunkSize: 2048,
    })
    stream.put(pdf, 'binary')

    res.header('Content-length', pdf.length.toString())

    return stream.pipe(res)
  }

  @UseGuards(JwtAuthGuard, RolesGuard, CaseExistsGuard, CaseWriteGuard)
  @RolesRules(judgeRule)
  @Post('case/:caseId/signature')
  @ApiCreatedResponse({
    type: SigningServiceResponse,
    description: 'Requests a signature for an existing case',
  })
  async requestSignature(
    @Param('caseId') _0: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @Res() res: Response,
  ) {
    if (user?.id !== theCase.judgeId) {
      throw new ForbiddenException(
        'A ruling must be signed by the assigned judge',
      )
    }

    try {
      const response = await this.caseService.requestSignature(theCase)
      return res.status(201).send(response)
    } catch (error) {
      if (error instanceof DokobitError) {
        return res.status(error.status).json({
          code: error.code,
          message: error.message,
        })
      }

      throw error
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard, CaseExistsGuard, CaseWriteGuard)
  @RolesRules(judgeRule)
  @Get('case/:caseId/signature')
  @ApiOkResponse({
    type: SignatureConfirmationResponse,
    description:
      'Confirms a previously requested signature for an existing case',
  })
  async getSignatureConfirmation(
    @Param('caseId') _0: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @Query('documentToken') documentToken: string,
  ): Promise<SignatureConfirmationResponse> {
    if (user?.id !== theCase.judgeId) {
      throw new ForbiddenException(
        'A ruling must be signed by the assigned judge',
      )
    }

    return this.caseService.getSignatureConfirmation(theCase, documentToken)
  }

  @UseGuards(JwtAuthGuard, RolesGuard, CaseExistsGuard, CaseReadGuard)
  @RolesRules(prosecutorRule)
  @Post('case/:caseId/extend')
  @ApiCreatedResponse({
    type: Case,
    description: 'Clones a new case based on an existing case',
  })
  async extend(
    @Param('caseId') _0: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
  ): Promise<Case | null> {
    if (theCase.childCase) {
      return theCase.childCase
    }

    const extendedCase = await this.caseService.extend(theCase, user)

    const resCase = await this.caseService.findById(extendedCase.id)

    this.eventService.postEvent(CaseEvent.EXTEND, resCase as Case)

    return resCase
  }
}
