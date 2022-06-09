import { Body, Controller, Post, UseGuards, Inject } from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { InjectQueue, QueueService } from '@island.is/message-queue'
import { TokenGuard } from '@island.is/judicial-system/auth'

import { CaseEvent, EventService } from '../event'
import { InternalCreateCaseDto } from './dto/internalCreateCase.dto'
import { Case } from './models/case.model'
import { ArchiveResponse } from './models/archive.response'
import { CaseService } from './case.service'
import { caseModuleConfig } from './case.config'

@Controller('api/internal')
@ApiTags('internal cases')
@UseGuards(TokenGuard)
export class InternalCaseController {
  constructor(
    private readonly caseService: CaseService,
    private readonly eventService: EventService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    @InjectQueue(caseModuleConfig().sqs.queueName) private queue: QueueService,
  ) {}

  @Post('case')
  @ApiCreatedResponse({ type: Case, description: 'Creates a new case' })
  async create(@Body() caseToCreate: InternalCreateCaseDto): Promise<Case> {
    this.logger.debug('Creating a new case')

    const createdCase = await this.caseService.internalCreate(caseToCreate)

    this.eventService.postEvent(CaseEvent.CREATE_XRD, createdCase as Case)

    return createdCase
  }

  @UseGuards(TokenGuard)
  @Post('cases/archive')
  @ApiOkResponse({
    type: ArchiveResponse,
    description: 'Archives a single case if any case is ready to be archived',
  })
  archive(): Promise<ArchiveResponse> {
    this.logger.debug('Archiving a case')

    return this.caseService.archive()
  }
}
