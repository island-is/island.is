import { Response } from 'express'

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  ForbiddenException,
  Query,
  Res,
  Header,
  UseGuards,
  BadRequestException,
  HttpException,
  Inject,
  ParseBoolPipe,
  UseInterceptors,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  DokobitError,
  SigningServiceResponse,
} from '@island.is/dokobit-signing'
import {
  CaseState,
  CaseType,
  completedCaseStates,
  indictmentCases,
  investigationCases,
  isIndictmentCase,
  restrictionCases,
  UserRole,
} from '@island.is/judicial-system/types'
import type { User } from '@island.is/judicial-system/types'
import {
  CurrentHttpUser,
  JwtAuthGuard,
  RolesRules,
  RolesGuard,
} from '@island.is/judicial-system/auth'

import {
  judgeRule,
  prosecutorRule,
  registrarRule,
  representativeRule,
  staffRule,
  assistantRule,
} from '../../guards'
import { nowFactory } from '../../factories'
import { UserService } from '../user'
import { CaseEvent, EventService } from '../event'
import { CaseExistsGuard } from './guards/caseExists.guard'
import { CaseReadGuard } from './guards/caseRead.guard'
import { CaseWriteGuard } from './guards/caseWrite.guard'
import { CaseTypeGuard } from './guards/caseType.guard'
import { CurrentCase } from './guards/case.decorator'
import {
  staffUpdateRule,
  judgeTransitionRule,
  judgeUpdateRule,
  prosecutorTransitionRule,
  prosecutorUpdateRule,
  registrarTransitionRule,
  registrarUpdateRule,
  representativeTransitionRule,
  representativeUpdateRule,
  assistantUpdateRule,
  assistantTransitionRule,
} from './guards/rolesRules'
import { CreateCaseDto } from './dto/createCase.dto'
import { TransitionCaseDto } from './dto/transitionCase.dto'
import { UpdateCaseDto } from './dto/updateCase.dto'
import { Case } from './models/case.model'
import { SignatureConfirmationResponse } from './models/signatureConfirmation.response'
import { CaseListInterceptor } from './interceptors/caseList.interceptor'
import { transitionCase } from './state/case.state'
import { CaseService } from './case.service'

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
    assignedUserRole: UserRole[],
    institutionId: string | undefined,
  ) {
    const assignedUser = await this.userService.findById(assignedUserId)

    if (!assignedUserRole.includes(assignedUser.role)) {
      throw new ForbiddenException(
        `User ${assignedUserId} does not have an acceptable role ${assignedUserRole}}`,
      )
    }

    if (institutionId && assignedUser.institutionId !== institutionId) {
      throw new ForbiddenException(
        `User ${assignedUserId} belongs to the wrong institution`,
      )
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(prosecutorRule, representativeRule)
  @Post('case')
  @ApiCreatedResponse({ type: Case, description: 'Creates a new case' })
  async create(
    @CurrentHttpUser() user: User,
    @Body() caseToCreate: CreateCaseDto,
  ): Promise<Case> {
    this.logger.debug('Creating a new case')

    const createdCase = await this.caseService.create(caseToCreate, user)

    this.eventService.postEvent(CaseEvent.CREATE, createdCase as Case)

    return createdCase
  }

  @UseGuards(JwtAuthGuard, RolesGuard, CaseExistsGuard, CaseWriteGuard)
  @RolesRules(
    prosecutorUpdateRule,
    representativeUpdateRule,
    judgeUpdateRule,
    registrarUpdateRule,
    assistantUpdateRule,
    staffUpdateRule,
  )
  @Patch('case/:caseId')
  @ApiOkResponse({ type: Case, description: 'Updates an existing case' })
  async update(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @Body() caseToUpdate: UpdateCaseDto,
  ): Promise<Case> {
    this.logger.debug(`Updating case ${caseId}`)

    // Make sure valid users are assigned to the case's roles
    if (caseToUpdate.prosecutorId) {
      await this.validateAssignedUser(
        caseToUpdate.prosecutorId,
        [UserRole.PROSECUTOR],
        theCase.creatingProsecutor?.institutionId,
      )

      // If the case was created via xRoad, then there may not have been a creating prosecutor
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
        [UserRole.JUDGE, UserRole.ASSISTANT],
        theCase.courtId,
      )
    }

    if (caseToUpdate.registrarId) {
      await this.validateAssignedUser(
        caseToUpdate.registrarId,
        [UserRole.REGISTRAR],
        theCase.courtId,
      )
    }

    return this.caseService.update(theCase, caseToUpdate, user) as Promise<Case> // Never returns undefined
  }

  @UseGuards(JwtAuthGuard, CaseExistsGuard, RolesGuard, CaseWriteGuard)
  @RolesRules(
    prosecutorTransitionRule,
    representativeTransitionRule,
    judgeTransitionRule,
    registrarTransitionRule,
    assistantTransitionRule,
  )
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

    const state = transitionCase(transition.transition, theCase.state)

    // TODO: UpdateCaseDto does not contain state - create a new type for CaseService.update
    const update: {
      state: CaseState
      parentCaseId?: null
      rulingDate?: Date
    } = { state }

    if (state === CaseState.DELETED) {
      update.parentCaseId = null
    }

    if (isIndictmentCase(theCase.type) && completedCaseStates.includes(state)) {
      update.rulingDate = nowFactory()
    }

    const updatedCase = await this.caseService.update(
      theCase,
      update as UpdateCaseDto,
      user,
      state !== CaseState.DELETED,
    )

    // No need to wait
    this.eventService.postEvent(
      (transition.transition as unknown) as CaseEvent,
      updatedCase ?? theCase,
    )

    return updatedCase ?? theCase
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesRules(
    prosecutorRule,
    representativeRule,
    judgeRule,
    registrarRule,
    assistantRule,
    staffRule,
  )
  @Get('cases')
  @ApiOkResponse({
    type: Case,
    isArray: true,
    description: 'Gets all existing cases',
  })
  @UseInterceptors(CaseListInterceptor)
  getAll(@CurrentHttpUser() user: User): Promise<Case[]> {
    this.logger.debug('Getting all cases')

    return this.caseService.getAll(user)
  }

  @UseGuards(JwtAuthGuard, RolesGuard, CaseExistsGuard, CaseReadGuard)
  @RolesRules(
    prosecutorRule,
    representativeRule,
    judgeRule,
    registrarRule,
    assistantRule,
    staffRule,
  )
  @Get('case/:caseId')
  @ApiOkResponse({ type: Case, description: 'Gets an existing case' })
  getById(@Param('caseId') caseId: string, @CurrentCase() theCase: Case): Case {
    this.logger.debug(`Getting case ${caseId} by id`)

    return theCase
  }

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseReadGuard,
  )
  @RolesRules(prosecutorRule, judgeRule, registrarRule)
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

    const pdf = await this.caseService.getRequestPdf(theCase)

    res.end(pdf)
  }

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    CaseReadGuard,
  )
  @RolesRules(
    prosecutorRule,
    representativeRule,
    judgeRule,
    registrarRule,
    assistantRule,
  )
  @Get('case/:caseId/caseFiles/:policeCaseNumber')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Gets the case files for an existing case as a pdf document',
  })
  async getCaseFilesPdf(
    @Param('caseId') caseId: string,
    @Param('policeCaseNumber') policeCaseNumber: string,
    @CurrentCase() theCase: Case,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.debug(
      `Getting the case files for case ${caseId} as a pdf document`,
    )

    if (!theCase.policeCaseNumbers.includes(policeCaseNumber)) {
      throw new BadRequestException(
        `Case ${caseId} does not include police case number ${policeCaseNumber}`,
      )
    }

    const pdf = await this.caseService.getCaseFilesPdf(
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
  )
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

    const pdf = await this.caseService.getCourtRecordPdf(theCase, user)

    res.end(pdf)
  }

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseReadGuard,
  )
  @RolesRules(prosecutorRule, judgeRule, registrarRule, staffRule)
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
    @Query('useSigned', ParseBoolPipe) useSigned: boolean,
  ): Promise<void> {
    this.logger.debug(`Getting the ruling for case ${caseId} as a pdf document`)

    const pdf = await this.caseService.getRulingPdf(theCase, useSigned)

    res.end(pdf)
  }

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard([CaseType.CUSTODY, CaseType.ADMISSION_TO_FACILITY]),
    CaseReadGuard,
  )
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

    if (theCase.state !== CaseState.ACCEPTED) {
      throw new BadRequestException(
        `Cannot generate a custody notice for ${theCase.state} cases`,
      )
    }

    const pdf = await this.caseService.getCustodyPdf(theCase)

    res.end(pdf)
  }

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseWriteGuard,
  )
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

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseWriteGuard,
  )
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

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseWriteGuard,
  )
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

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseWriteGuard,
  )
  @RolesRules(judgeRule)
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

    if (user.id !== theCase.judgeId) {
      throw new ForbiddenException(
        'A ruling must be signed by the assigned judge',
      )
    }

    return this.caseService.getRulingSignatureConfirmation(
      theCase,
      user,
      documentToken,
    )
  }

  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseReadGuard,
  )
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
  ): Promise<Case> {
    this.logger.debug(`Extending case ${caseId}`)

    if (theCase.childCase) {
      return theCase.childCase
    }

    const extendedCase = await this.caseService.extend(theCase, user)

    this.eventService.postEvent(CaseEvent.EXTEND, extendedCase as Case)

    return extendedCase
  }

  @UseGuards(JwtAuthGuard, RolesGuard, CaseExistsGuard, CaseWriteGuard)
  @RolesRules(judgeRule, registrarRule, assistantRule)
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
