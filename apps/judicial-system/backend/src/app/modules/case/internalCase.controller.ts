import {
  Body,
  Controller,
  Post,
  UseGuards,
  Inject,
  Param,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { TokenGuard } from '@island.is/judicial-system/auth'
import {
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { CaseEvent, EventService } from '../event'
import { CaseExistsGuard } from './guards/caseExists.guard'
import { CaseCompletedGuard } from './guards/caseCompleted.guard'
import { CaseTypeGuard } from './guards/caseType.guard'
import { CurrentCase } from './guards/case.decorator'
import { InternalCreateCaseDto } from './dto/internalCreateCase.dto'
import { Case } from './models/case.model'
import { ArchiveResponse } from './models/archive.response'
import { DeliverCompletedCaseResponse } from './models/deliverCompletedCase.response'
import { DeliverProsecutorDocumentsResponse } from './models/deliverProsecutorDocuments.response'
import { DeliverResponse } from './models/deliver.response'
import { InternalCaseService } from './internalCase.service'

@Controller('api/internal')
@ApiTags('internal cases')
@UseGuards(TokenGuard)
export class InternalCaseController {
  constructor(
    private readonly internalCaseService: InternalCaseService,
    private readonly eventService: EventService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post('case')
  @ApiCreatedResponse({ type: Case, description: 'Creates a new case' })
  async create(@Body() caseToCreate: InternalCreateCaseDto): Promise<Case> {
    this.logger.debug('Creating a new case')

    const createdCase = await this.internalCaseService.create(caseToCreate)

    this.eventService.postEvent(CaseEvent.CREATE_XRD, createdCase as Case)

    return createdCase
  }

  @Post('cases/archive')
  @ApiOkResponse({
    type: ArchiveResponse,
    description: 'Archives a single case if any case is ready to be archived',
  })
  archive(): Promise<ArchiveResponse> {
    this.logger.debug('Archiving a case')

    return this.internalCaseService.archive()
  }

  @UseGuards(CaseExistsGuard, CaseCompletedGuard)
  @Post('case/:caseId/deliver')
  @ApiOkResponse({
    type: DeliverCompletedCaseResponse,
    description: 'Delivers a completed case to court and police',
  })
  deliver(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
  ): Promise<DeliverCompletedCaseResponse> {
    this.logger.debug(`Delivering case ${caseId} to court and police`)

    return this.internalCaseService.deliver(theCase)
  }

  @UseGuards(CaseExistsGuard)
  @Post('case/:caseId/deliverProsecutorDocuments')
  @ApiOkResponse({
    type: DeliverProsecutorDocumentsResponse,
    description: 'Delivers prosecutor documents to court',
  })
  deliverProsecutorDocuments(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
  ): Promise<DeliverProsecutorDocumentsResponse> {
    this.logger.debug(
      `Delivering prosecutor documents for case ${caseId} to court`,
    )

    return this.internalCaseService.deliverProsecutorDocuments(theCase)
  }

  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseCompletedGuard,
  )
  @Post('case/:caseId/deliverCourtRecordToCourt')
  @ApiOkResponse({
    type: DeliverResponse,
    description: 'Delivers a court record to court',
  })
  deliverCourtRecordToCourt(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
  ): Promise<DeliverResponse> {
    this.logger.debug(`Delivering the court record for case ${caseId} to court`)

    return this.internalCaseService.deliverCourtRecordToCourt(theCase)
  }

  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseCompletedGuard,
  )
  @Post('case/:caseId/deliverSignedRulingToCourt')
  @ApiOkResponse({
    type: DeliverResponse,
    description: 'Delivers a court record to court',
  })
  deliverSignedRulingToCourt(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
  ): Promise<DeliverResponse> {
    this.logger.debug(`Delivering the court record for case ${caseId} to court`)

    return this.internalCaseService.deliverSignedRulingToCourt(theCase)
  }
}
