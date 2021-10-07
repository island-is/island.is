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

import { judgeRule, prosecutorRule, registrarRule } from '../../guards'
import { CaseFile } from '../file/models/file.model'
import { UserService } from '../user'
import { CaseEvent, EventService } from '../event'
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
    'courtId',
    'leadInvestigator',
    'arrestDate',
    'requestedCourtDate',
    'translator',
    'requestedValidToDate',
    'demands',
    'lawsBroken',
    'legalBasis',
    'custodyProvisions',
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
  'isAccusedRightsHidden',
  'accusedPleaDecision',
  'accusedPleaAnnouncement',
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(prosecutorUpdateRule, judgeUpdateRule, registrarUpdateRule)
  @Put('case/:id')
  @ApiOkResponse({ type: Case, description: 'Updates an existing case' })
  async update(
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
    @Body() caseToUpdate: UpdateCaseDto,
  ): Promise<Case | null> {
    // Make sure the user has access to this case
    const existingCase = await this.caseService.findByIdAndUser(id, user)

    // Make sure valid users are assigned to the case's roles
    if (caseToUpdate.prosecutorId) {
      await this.validateAssignedUser(
        caseToUpdate.prosecutorId,
        UserRole.PROSECUTOR,
        existingCase.prosecutor?.institutionId,
      )
    }
    if (caseToUpdate.judgeId) {
      await this.validateAssignedUser(
        caseToUpdate.judgeId,
        UserRole.JUDGE,
        existingCase.courtId,
      )
    }
    if (caseToUpdate.registrarId) {
      await this.validateAssignedUser(
        caseToUpdate.registrarId,
        UserRole.REGISTRAR,
        existingCase.courtId,
      )
    }

    const { numberOfAffectedRows, updatedCase } = await this.caseService.update(
      id,
      caseToUpdate,
    )

    if (numberOfAffectedRows === 0) {
      // TODO: Find a more suitable exception to throw
      throw new NotFoundException(`Case ${id} does not exist`)
    }

    if (
      existingCase.courtId &&
      IntegratedCourts.includes(existingCase.courtId) &&
      Boolean(caseToUpdate.courtCaseNumber) &&
      caseToUpdate.courtCaseNumber !== existingCase.courtCaseNumber
    ) {
      // TODO: Find a better place for this
      // No need to wait for the upload
      this.caseService.uploadRequestPdfToCourt(id)
    }

    return this.caseService.findById(updatedCase.id)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(
    prosecutorTransitionRule,
    judgeTransitionRule,
    registrarTransitionRule,
  )
  @Put('case/:id/state')
  @ApiOkResponse({
    type: Case,
    description: 'Transitions an existing case to a new state',
  })
  async transition(
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
    @Body() transition: TransitionCaseDto,
  ): Promise<Case | null> {
    // Use existingCase.modified when client is ready to send last modified timestamp with all updates
    const existingCase = await this.caseService.findByIdAndUser(id, user)

    const state = transitionCase(transition.transition, existingCase.state)

    // TODO: UpdateCaseDto does not contain state - create a new type for CaseService.update
    const update: { state: CaseState; parentCaseId?: null } = { state }

    if (state === CaseState.DELETED) {
      update.parentCaseId = null
    }

    const { numberOfAffectedRows, updatedCase } = await this.caseService.update(
      id,
      update as UpdateCaseDto,
    )

    if (numberOfAffectedRows === 0) {
      throw new ConflictException(
        `A more recent version exists of the case with id ${id}`,
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
  @RolesRules(prosecutorRule, judgeRule, registrarRule)
  @Get('cases')
  @ApiOkResponse({
    type: Case,
    isArray: true,
    description: 'Gets all existing cases',
  })
  getAll(@CurrentHttpUser() user: User): Promise<Case[]> {
    return this.caseService.getAll(user)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(prosecutorRule, judgeRule, registrarRule)
  @Get('case/:id')
  @ApiOkResponse({ type: Case, description: 'Gets an existing case' })
  getById(
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
  ): Promise<Case> {
    return this.caseService.findByIdAndUser(id, user, false)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(prosecutorRule, judgeRule, registrarRule)
  @Get('case/:id/request')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Gets the request for an existing case as a pdf document',
  })
  async getRequestPdf(
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
    @Res() res: Response,
  ) {
    const existingCase = await this.caseService.findByIdAndUser(id, user, false)

    if (
      isInvestigationCase(existingCase.type) &&
      ((user.role === UserRole.JUDGE && user.id !== existingCase.judge?.id) ||
        (user.role === UserRole.REGISTRAR &&
          user.id !== existingCase.registrar?.id))
    ) {
      throw new ForbiddenException(
        'Only the assigned judge and registrar can get the request pdf for investigation cases',
      )
    }

    const pdf = await this.caseService.getRequestPdf(existingCase)

    const stream = new ReadableStreamBuffer({
      frequency: 10,
      chunkSize: 2048,
    })
    stream.put(pdf, 'binary')

    res.header('Content-length', pdf.length.toString())

    return stream.pipe(res)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(prosecutorRule, judgeRule, registrarRule)
  @Get('case/:id/ruling')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Gets the ruling for an existing case as a pdf document',
  })
  async getRulingPdf(
    @Param('id') id: string,
    @Query('shortVersion', ParseBoolPipe) shortVersion: boolean,
    @CurrentHttpUser() user: User,
    @Res() res: Response,
  ) {
    const existingCase = await this.caseService.findByIdAndUser(id, user, false)

    if (
      isInvestigationCase(existingCase.type) &&
      ((user.role === UserRole.JUDGE && user.id !== existingCase.judge?.id) ||
        (user.role === UserRole.REGISTRAR &&
          user.id !== existingCase.registrar?.id))
    ) {
      throw new ForbiddenException(
        'Only the assigned judge and registrar can get the ruling pdf for investigation cases',
      )
    }

    const pdf = await this.caseService.getRulingPdf(existingCase, shortVersion)

    const stream = new ReadableStreamBuffer({
      frequency: 10,
      chunkSize: 2048,
    })
    stream.put(pdf, 'binary')

    res.header('Content-length', pdf.length.toString())

    return stream.pipe(res)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(prosecutorRule, judgeRule, registrarRule)
  @Get('case/:id/custodyNotice')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description:
      'Gets custody notice for an existing custody case as a pdf document',
  })
  async getCustodyNoticePdf(
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
    @Res() res: Response,
  ) {
    const existingCase = await this.caseService.findByIdAndUser(id, user, false)

    if (existingCase.type !== CaseType.CUSTODY) {
      throw new BadRequestException(
        `Cannot generate a custody notice for ${existingCase.type} cases`,
      )
    }

    if (existingCase.state !== CaseState.ACCEPTED) {
      throw new BadRequestException(
        `Cannot generate a custody notice for ${existingCase.state} cases`,
      )
    }

    const pdf = await this.caseService.getCustodyPdf(existingCase)

    const stream = new ReadableStreamBuffer({
      frequency: 10,
      chunkSize: 2048,
    })
    stream.put(pdf, 'binary')

    res.header('Content-length', pdf.length.toString())

    return stream.pipe(res)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(judgeRule)
  @Post('case/:id/signature')
  @ApiCreatedResponse({
    type: SigningServiceResponse,
    description: 'Requests a signature for an existing case',
  })
  async requestSignature(
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
    @Res() res: Response,
  ) {
    const existingCase = await this.caseService.findByIdAndUser(id, user)

    if (user?.id !== existingCase.judgeId) {
      throw new ForbiddenException(
        'A ruling must be signed by the assigned judge',
      )
    }

    try {
      const response = await this.caseService.requestSignature(existingCase)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(judgeRule)
  @Get('case/:id/signature')
  @ApiOkResponse({
    type: SignatureConfirmationResponse,
    description:
      'Confirms a previously requested signature for an existing case',
  })
  async getSignatureConfirmation(
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
    @Query('documentToken') documentToken: string,
  ): Promise<SignatureConfirmationResponse> {
    const existingCase = await this.caseService.findByIdAndUser(
      id,
      user,
      true,
      [
        {
          model: CaseFile,
          as: 'caseFiles',
          separate: true,
          order: [['created', 'DESC']],
        },
      ],
    )

    if (user?.id !== existingCase.judgeId) {
      throw new ForbiddenException(
        'A ruling must be signed by the assigned judge',
      )
    }

    return this.caseService.getSignatureConfirmation(
      existingCase,
      documentToken,
    )
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(prosecutorRule)
  @Post('case/:id/extend')
  @ApiCreatedResponse({
    type: Case,
    description: 'Clones a new case based on an existing case',
  })
  async extend(
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
  ): Promise<Case | null> {
    const existingCase = await this.caseService.findByIdAndUser(id, user, false)

    if (existingCase.childCase) {
      return existingCase.childCase
    }

    const extendedCase = await this.caseService.extend(existingCase, user)

    const resCase = await this.caseService.findById(extendedCase.id)

    this.eventService.postEvent(CaseEvent.EXTEND, resCase as Case)

    return resCase
  }
}
