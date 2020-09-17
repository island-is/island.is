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
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { LOGGER_PROVIDER, Logger } from '@island.is/logging'

import { JwtAuthGuard } from '../auth'
import { CreateCaseDto, UpdateCaseDto } from './dto'
import { Case } from './case.model'
import { Notification } from './case.types'
import { CaseService } from './case.service'
import { CaseValidationPipe } from './case.pipe'

@UseGuards(JwtAuthGuard)
@Controller('api')
@ApiTags('cases')
export class CaseController {
  constructor(
    private readonly caseService: CaseService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  @Get('cases')
  @ApiOkResponse({ type: Case, isArray: true })
  getAll(): Promise<Case[]> {
    return this.caseService.getAll()
  }

  @Get('case/:id')
  @ApiOkResponse({ type: Case })
  async getById(@Param('id') id: string): Promise<Case> {
    const existingCase = await this.caseService.findById(id)

    if (!existingCase) {
      throw new NotFoundException(`A case with the id ${id} does not exist`)
    }

    return existingCase
  }

  @Post('case')
  @ApiCreatedResponse({ type: Case })
  create(
    @Body(new CaseValidationPipe(true))
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
  getAllNotificationsById(@Param('id') id: string): Promise<Notification[]> {
    return this.caseService.getAllNotificationsByCaseId(id)
  }

  @Post('case/:id/notification')
  @ApiOkResponse({ type: Notification })
  async sendNotificationByCaseId(
    @Param('id') id: string,
  ): Promise<Notification> {
    const existingCase = await this.caseService.findById(id)

    if (!existingCase) {
      throw new NotFoundException(`A case with the id ${id} does not exist`)
    }

    return this.caseService.sendNotificationByCaseId(existingCase)
  }
}
