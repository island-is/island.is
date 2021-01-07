import { ReadableStreamBuffer } from 'stream-buffers'

import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Inject,
  ForbiddenException,
  Query,
  ConflictException,
  Res,
  Header,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import {
  DokobitError,
  SigningServiceResponse,
} from '@island.is/dokobit-signing'
import {
  CaseTransition,
  User,
  UserRole,
} from '@island.is/judicial-system/types'
import {
  CurrentHttpUser,
  JwtAuthGuard,
  RolesRules,
  RolesGuard,
  RolesRule,
  RulesType,
} from '@island.is/judicial-system/auth'

import { CreateCaseDto, TransitionCaseDto, UpdateCaseDto } from './dto'
import { Case, SignatureConfirmationResponse } from './models'
import { transitionCase } from './state'
import { CaseService } from './case.service'
import { CaseValidationPipe } from './pipes'

// Allows prosecutors to perform any action
const prosecutorRule = UserRole.PROSECUTOR as RolesRule

// Allows judges to perform any action
const judgeRule = UserRole.JUDGE as RolesRule

// Allows prosecutors to update a specific set of fields
const prosecutorUpdateRule = {
  role: UserRole.PROSECUTOR,
  type: RulesType.FIELD,
  dtoFields: [
    'policeCaseNumber',
    'accusedNationalId',
    'accusedName',
    'accusedAddress',
    'accusedGender',
    'requestedDefenderName',
    'requestedDefenderEmail',
    'court',
    'arrestDate',
    'requestedCourtDate',
    'alternativeTravelBan',
    'requestedCustodyEndDate',
    'lawsBroken',
    'custodyProvisions',
    'requestedCustodyRestrictions',
    'caseFacts',
    'legalArguments',
    'comments',
  ],
} as RolesRule

// Allows judges to update a specific set of fields
const judgeUpdateRule = {
  role: UserRole.JUDGE,
  type: RulesType.FIELD,
  dtoFields: [
    'courtCaseNumber',
    'courtDate',
    'courtRoom',
    'defenderName',
    'defenderEmail',
    'courtStartTime',
    'courtEndTime',
    'courtAttendees',
    'policeDemands',
    'accusedPlea',
    'litigationPresentations',
    'ruling',
    'decision',
    'custodyEndDate',
    'custodyRestrictions',
    'accusedAppealDecision',
    'accusedAppealAnnouncement',
    'prosecutorAppealDecision',
    'prosecutorAppealAnnouncement',
  ],
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
  ],
} as RolesRule

@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('api')
@ApiTags('cases')
export class CaseController {
  constructor(
    @Inject(CaseService)
    private readonly caseService: CaseService,
  ) {}

  private async findCaseById(id: string) {
    const existingCase = await this.caseService.findById(id)

    if (!existingCase) {
      throw new NotFoundException(`Case ${id} does not exist`)
    }

    return existingCase
  }

  @RolesRules(prosecutorRule)
  @Post('case')
  @ApiCreatedResponse({ type: Case, description: 'Creates a new case' })
  create(
    @Body(new CaseValidationPipe())
    caseToCreate: CreateCaseDto,
  ): Promise<Case> {
    return this.caseService.create(caseToCreate)
  }

  @RolesRules(prosecutorUpdateRule, judgeUpdateRule)
  @Put('case/:id')
  @ApiOkResponse({ type: Case, description: 'Updates an existing case' })
  async update(
    @Param('id') id: string,
    @Body() caseToUpdate: UpdateCaseDto,
  ): Promise<Case> {
    const { numberOfAffectedRows, updatedCase } = await this.caseService.update(
      id,
      caseToUpdate,
    )

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`Case ${id} does not exist`)
    }

    return updatedCase
  }

  @RolesRules(prosecutorTransitionRule, judgeTransitionRule)
  @Put('case/:id/state')
  @ApiOkResponse({
    type: Case,
    description: 'Transitions an existing case to a new state',
  })
  async transition(
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
    @Body() transition: TransitionCaseDto,
  ): Promise<Case> {
    // Use existingCase.modified when client is ready to send last modified timestamp with all updates

    const existingCase = await this.findCaseById(id)

    const update = {
      state: transitionCase(transition.transition, existingCase.state),
    } as UpdateCaseDto

    update[user.role === UserRole.PROSECUTOR ? 'prosecutorId' : 'judgeId'] =
      user.id

    const { numberOfAffectedRows, updatedCase } = await this.caseService.update(
      id,
      update,
    )

    if (numberOfAffectedRows === 0) {
      throw new ConflictException(
        `A more recent version exists of the case with id ${id}`,
      )
    }

    return updatedCase
  }

  @Get('cases')
  @ApiOkResponse({
    type: Case,
    isArray: true,
    description: 'Gets all existing cases',
  })
  getAll(): Promise<Case[]> {
    return this.caseService.getAll()
  }

  @Get('case/:id')
  @ApiOkResponse({ type: Case, description: 'Gets an existing case' })
  async getById(@Param('id') id: string): Promise<Case> {
    return this.findCaseById(id)
  }

  @RolesRules(judgeRule)
  @Get('case/:id/ruling')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Gets the ruling for an existing case as a pdf document',
  })
  async getRulingPdf(
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
    @Res() res,
  ) {
    const existingCase = await this.findCaseById(id)

    const pdf = await this.caseService.getRulingPdf(existingCase, user)

    const stream = new ReadableStreamBuffer({
      frequency: 10,
      chunkSize: 2048,
    })
    stream.put(pdf, 'binary')

    res.header('Content-length', pdf.length)

    return stream.pipe(res)
  }

  @RolesRules(judgeRule)
  @Post('case/:id/signature')
  @ApiCreatedResponse({
    type: SigningServiceResponse,
    description: 'Requests a signature for an existing case',
  })
  async requestSignature(
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
    @Res() res,
  ): Promise<SigningServiceResponse> {
    const existingCase = await this.findCaseById(id)

    if (user.role !== UserRole.JUDGE) {
      throw new ForbiddenException('A ruling must be signed by a judge')
    }

    try {
      const response = await this.caseService.requestSignature(
        existingCase,
        user,
      )
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
    const existingCase = await this.findCaseById(id)

    if (user.role !== UserRole.JUDGE) {
      throw new ForbiddenException('A ruling must be signed by a judge')
    }

    return this.caseService.getSignatureConfirmation(
      existingCase,
      user,
      documentToken,
    )
  }
}
