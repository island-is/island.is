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
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import {
  DokobitError,
  SigningServiceResponse,
} from '@island.is/dokobit-signing'
import { EmailService } from '@island.is/email-service'
import { CaseState, CaseTransition } from '@island.is/judicial-system/types'

import { environment } from '../../../environments'
import { UserService } from '../user'
import {
  CreateCaseDto,
  SendNotificationDto,
  TransitionCaseDto,
  UpdateCaseDto,
} from './dto'
import { Case, Notification, SignatureResponse } from './models'
import { generateRequestPdf } from './pdf'
import { CaseService } from './case.service'
import { CaseValidationPipe } from './case.pipe'
import { transitionCase as transitionUpdate } from './case.state'

@Controller('api')
@ApiTags('cases')
export class CaseController {
  constructor(
    private readonly caseService: CaseService,
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(EmailService)
    private readonly emailService: EmailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private async findCaseById(id: string) {
    const existingCase = await this.caseService.findById(id)

    if (!existingCase) {
      throw new NotFoundException(`Case ${id} does not exist`)
    }

    return existingCase
  }

  private async findUserByNationalId(nationalId: string) {
    const user = await this.userService.findByNationalId(nationalId)

    if (!user) {
      throw new NotFoundException(`User ${nationalId} not found`)
    }

    return user
  }

  private async sendRequestAsPdf(
    existingCase: Case,
    pdf: string,
  ): Promise<void> {
    await this.emailService.sendEmail({
      from: {
        name: environment.email.fromName,
        address: environment.email.fromEmail,
      },
      replyTo: {
        name: environment.email.replyToName,
        address: environment.email.replyToEmail,
      },
      to: [
        {
          name: existingCase.prosecutor?.name,
          address: existingCase.prosecutor?.email,
        },
      ],
      subject: `Krafa í máli ${existingCase.policeCaseNumber}`,
      text: 'Sjá viðhengi',
      html: 'Sjá viðhengi',
      attachments: [
        {
          filename: `${existingCase.policeCaseNumber}.pdf`,
          content: pdf,
          encoding: 'binary',
        },
      ],
    })
  }

  @Post('case')
  @ApiCreatedResponse({ type: Case, description: 'Creates a new case' })
  create(
    @Body(new CaseValidationPipe())
    caseToCreate: CreateCaseDto,
  ): Promise<Case> {
    return this.caseService.create(caseToCreate)
  }

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

  @Put('case/:id/state')
  @ApiOkResponse({
    type: Case,
    description: 'Transitions an existing case to a new state',
  })
  async transition(
    @Param('id') id: string,
    @Body() transition: TransitionCaseDto,
  ): Promise<Case> {
    // Use existingCase.modified when client is ready to send last modified timestamp with all updates

    const existingCase = await this.findCaseById(id)

    const user = await this.findUserByNationalId(transition.nationalId)

    const update = transitionUpdate(transition, existingCase, user)

    const { numberOfAffectedRows, updatedCase } = await this.caseService.update(
      id,
      update,
    )

    if (numberOfAffectedRows === 0) {
      throw new ConflictException(
        `A more recent version exists of the case with id ${id}`,
      )
    }

    // Find a better place for this
    if (transition.transition === CaseTransition.SUBMIT) {
      const dbCase = await this.findCaseById(id)

      const pdf = await generateRequestPdf(dbCase)

      await this.sendRequestAsPdf(dbCase, pdf)
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

  @Post('case/:id/notification')
  @ApiCreatedResponse({
    type: Notification,
    description: 'Sends a new notification for an existing case',
  })
  async sendNotificationByCaseId(
    @Param('id') id: string,
    @Body() notification: SendNotificationDto,
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

    const user = await this.findUserByNationalId(notification.nationalId)

    return this.caseService.sendNotificationByCaseId(existingCase, user)
  }

  @Get('case/:id/notifications')
  @ApiOkResponse({
    type: Notification,
    isArray: true,
    description: 'Gets all existing notifications for an existing case',
  })
  async getAllNotificationsById(
    @Param('id') id: string,
  ): Promise<Notification[]> {
    const existingCase = await this.findCaseById(id)

    return this.caseService.getAllNotificationsByCaseId(existingCase)
  }

  @Post('case/:id/signature')
  @ApiCreatedResponse({
    type: SigningServiceResponse,
    description: 'Requests a signature for an existing case',
  })
  async requestSignature(
    @Param('id') id: string,
    @Res() res,
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

    if (!existingCase.judge) {
      throw new ForbiddenException('A ruling must be signed by a judge')
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

  @Get('case/:id/signature')
  @ApiOkResponse({
    type: SignatureResponse,
    description:
      'Confirms a previously requested signature for an existing case',
  })
  async confirmSignature(
    @Param('id') id: string,
    @Query('documentToken') documentToken: string,
  ): Promise<SignatureResponse> {
    const existingCase = await this.findCaseById(id)

    if (
      existingCase.state !== CaseState.ACCEPTED &&
      existingCase.state !== CaseState.REJECTED
    ) {
      throw new ForbiddenException(
        `Cannot confirm a ruling signature for a case in state ${existingCase.state}`,
      )
    }

    return this.caseService.confirmSignature(existingCase, documentToken)
  }
}
