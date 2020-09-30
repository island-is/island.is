import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
  Inject,
  Req,
  ForbiddenException,
  Query,
  ConflictException,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import { SigningServiceResponse } from '@island.is/dokobit-signing'
import { CaseTransition, CaseState } from '@island.is/judicial-system/types'

import { JwtAuthGuard, AuthUser } from '../auth'
import { UserService } from '../user'
import { CreateCaseDto, UpdateCaseDto } from './dto'
import { Case, Notification } from './models'
import { CaseService } from './case.service'
import { CaseValidationPipe } from './case.pipe'
import { TransitionCaseDto } from './dto/transitionCase.dto'

const caseStateMachine = {}
caseStateMachine[CaseTransition.SUBMIT] = {
  from: CaseState.DRAFT,
  to: CaseState.SUBMITTED,
}
caseStateMachine[CaseTransition.ACCEPT] = {
  from: CaseState.SUBMITTED,
  to: CaseState.ACCEPTED,
}
caseStateMachine[CaseTransition.REJECT] = {
  from: CaseState.SUBMITTED,
  to: CaseState.REJECTED,
}

@UseGuards(JwtAuthGuard)
@Controller('api')
@ApiTags('cases')
export class CaseController {
  constructor(
    private readonly caseService: CaseService,
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Get('cases')
  @ApiOkResponse({ type: Case, isArray: true, description: 'Gets all cases' })
  getAll(): Promise<Case[]> {
    return this.caseService.getAll()
  }

  @Get('case/:id')
  @ApiOkResponse({ type: Case })
  async getById(@Param('id') id: string): Promise<Case> {
    return this.findCaseById(id)
  }

  @Post('case')
  @ApiCreatedResponse({ type: Case })
  create(
    @Body(new CaseValidationPipe())
    caseToCreate: CreateCaseDto,
  ): Promise<Case> {
    return this.caseService.create(caseToCreate)
  }

  @Put('case/:id')
  @ApiOkResponse({ type: Case })
  async update(
    @Param('id') id: string,
    @Body() caseToUpdate: UpdateCaseDto,
  ): Promise<Case> {
    const { numberOfAffectedRows, updatedCase } = await this.caseService.update(
      id,
      caseToUpdate,
    )

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`A case with the id ${id} does not exist`)
    }

    return updatedCase
  }

  @Put('case/:id/state')
  @ApiOkResponse({ type: Case })
  async transition(
    @Param('id') id: string,
    @Body() caseToTransition: TransitionCaseDto,
  ): Promise<Case> {
    const existingCase = await this.findCaseById(id)

    if (
      caseStateMachine[caseToTransition.transition].from !== existingCase.state
    ) {
      throw new ForbiddenException(
        `The transition ${caseToTransition.transition} cannot be applied to a case in state ${existingCase.state}`,
      )
    }

    const {
      numberOfAffectedRows,
      updatedCase,
    } = await this.caseService.transition(
      id,
      caseToTransition.modified,
      caseStateMachine[caseToTransition.transition].to,
    )

    if (numberOfAffectedRows === 0) {
      throw new ConflictException(
        `A more recent version exists of case with id ${id}`,
      )
    }

    return updatedCase
  }

  @Get('case/:id/notifications')
  @ApiOkResponse({ type: Notification, isArray: true })
  async getAllNotificationsById(
    @Param('id') id: string,
  ): Promise<Notification[]> {
    const existingCase = await this.findCaseById(id)

    return this.caseService.getAllNotificationsByCaseId(existingCase)
  }

  @Post('case/:id/notification')
  @ApiCreatedResponse({ type: Notification })
  async sendNotificationByCaseId(
    @Param('id') id: string,
    @Req() req,
  ): Promise<Notification> {
    const existingCase = await this.findCaseById(id)

    if (
      existingCase.state !== CaseState.DRAFT &&
      existingCase.state !== CaseState.SUBMITTED
    ) {
      throw new ForbiddenException(
        `Cannot send a notification for a case in state ${existingCase.state}`,
      )
    }

    const authUser: AuthUser = req.user

    const user = await this.userService.findByNationalId(authUser.nationalId)

    return this.caseService.sendNotificationByCaseId(existingCase, user)
  }

  @Get('case/:id/signature')
  @ApiOkResponse({ type: Case })
  async confirmSignature(
    @Param('id') id: string,
    @Query('documentToken') documentToken: string,
  ): Promise<Case> {
    const existingCase = await this.findCaseById(id)

    if (
      existingCase.state !== CaseState.ACCEPTED &&
      existingCase.state !== CaseState.REJECTED
    ) {
      throw new ForbiddenException(
        `Cannot confirm a ruling signature for a case in state ${existingCase.state}`,
      )
    }

    return this.caseService.confirrmSignature(existingCase, documentToken)
  }

  @Post('case/:id/signature')
  @ApiCreatedResponse({ type: SigningServiceResponse })
  async requestSignature(
    @Param('id') id: string,
    @Req() req,
  ): Promise<SigningServiceResponse> {
    const existingCase = await this.findCaseById(id)

    if (
      existingCase.state !== CaseState.ACCEPTED &&
      existingCase.state !== CaseState.REJECTED
    ) {
      throw new ForbiddenException(
        `Cannot sign a ruling for a case in state ${existingCase.state}`,
      )
    }

    const authUser: AuthUser = req.user

    const user = await this.userService.findByNationalId(authUser.nationalId)

    return this.caseService.requestSignature(existingCase, user)
  }

  private async findCaseById(id: string) {
    const existingCase = await this.caseService.findById(id)

    if (!existingCase) {
      throw new NotFoundException(`A case with the id ${id} does not exist`)
    }

    return existingCase
  }
}
