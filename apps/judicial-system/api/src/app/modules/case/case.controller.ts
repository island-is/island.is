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
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { LOGGER_PROVIDER, Logger } from '@island.is/logging'

import { JwtAuthGuard, AuthUser } from '../auth'
import { UserService } from '../user'
import { CreateCaseDto, UpdateCaseDto } from './dto'
import { Case, Notification, CaseState } from './models'
import { CaseService } from './case.service'
import { CaseValidationPipe } from './case.pipe'

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
  @ApiOkResponse({ type: Case, isArray: true })
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
    @Body()
    caseToUpdate: UpdateCaseDto,
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

  @Get('case/:id/notifications')
  @ApiOkResponse({ type: Notification, isArray: true })
  async getAllNotificationsById(
    @Param('id') id: string,
  ): Promise<Notification[]> {
    const existingCase = await this.findCaseById(id)

    return this.caseService.getAllNotificationsByCaseId(existingCase)
  }

  @Post('case/:id/notification')
  @ApiOkResponse({ type: Notification })
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
        `Cannot send a notification for case in state ${existingCase.state}`,
      )
    }

    const authUser: AuthUser = req.user

    const user = await this.userService.findByNationalId(authUser)

    return this.caseService.sendNotificationByCaseId(existingCase, user)
  }

  private async findCaseById(id: string) {
    const existingCase = await this.caseService.findById(id)

    if (!existingCase) {
      throw new NotFoundException(`A case with the id ${id} does not exist`)
    }

    return existingCase
  }
}
