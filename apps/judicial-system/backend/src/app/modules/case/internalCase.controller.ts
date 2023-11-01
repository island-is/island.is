import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { TokenGuard } from '@island.is/judicial-system/auth'
import {
  indictmentCases,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { CaseEvent, EventService } from '../event'
import { DeliverDto } from './dto/deliver.dto'
import { InternalCreateCaseDto } from './dto/internalCreateCase.dto'
import { CurrentCase } from './guards/case.decorator'
import { CaseCompletedGuard } from './guards/caseCompleted.guard'
import { CaseExistsGuard } from './guards/caseExists.guard'
import { CaseTypeGuard } from './guards/caseType.guard'
import { ArchiveResponse } from './models/archive.response'
import { Case } from './models/case.model'
import { DeliverResponse } from './models/deliver.response'
import { InternalCaseService } from './internalCase.service'

@Controller('api/internal')
@ApiTags('internal cases')
//@UseGuards(TokenGuard)
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

  @UseGuards(CaseExistsGuard)
  @Post('case/:caseId/deliverProsecutorToCourt')
  @ApiOkResponse({
    type: DeliverResponse,
    description: 'Delivers a prosecutor to court',
  })
  deliverProsecutorToCourt(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Body() deliverDto: DeliverDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(`Delivering the prosecutor for case ${caseId} to court`)

    return this.internalCaseService.deliverProsecutorToCourt(
      theCase,
      deliverDto.user,
    )
  }

  @UseGuards(CaseExistsGuard, new CaseTypeGuard(indictmentCases))
  @Post('case/:caseId/deliverCaseFilesRecordToCourt/:policeCaseNumber')
  @ApiOkResponse({
    type: DeliverResponse,
    description: 'Delivers a case files record to court',
  })
  async deliverCaseFilesRecordToCourt(
    @Param('caseId') caseId: string,
    @Param('policeCaseNumber') policeCaseNumber: string,
    @CurrentCase() theCase: Case,
    @Body() deliverDto: DeliverDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Delivering the case files record for case ${caseId} and police case ${policeCaseNumber} to court`,
    )

    if (!theCase.policeCaseNumbers.includes(policeCaseNumber)) {
      throw new BadRequestException(
        `Case ${caseId} does not include police case number ${policeCaseNumber}`,
      )
    }

    return this.internalCaseService.deliverCaseFilesRecordToCourt(
      theCase,
      policeCaseNumber,
      deliverDto.user,
    )
  }

  @UseGuards(CaseExistsGuard, new CaseTypeGuard(indictmentCases))
  @Post('case/:caseId/archiveCaseFilesRecord/:policeCaseNumber')
  @ApiOkResponse({
    type: DeliverResponse,
    description: 'Archives a case files record',
  })
  async archiveCaseFilesRecord(
    @Param('caseId') caseId: string,
    @Param('policeCaseNumber') policeCaseNumber: string,
    @CurrentCase() theCase: Case,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Archiving the case files record for case ${caseId} and police case ${policeCaseNumber}`,
    )

    if (!theCase.policeCaseNumbers.includes(policeCaseNumber)) {
      throw new BadRequestException(
        `Case ${caseId} does not include police case number ${policeCaseNumber}`,
      )
    }

    return this.internalCaseService.archiveCaseFilesRecord(
      theCase,
      policeCaseNumber,
    )
  }

  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
  )
  @Post('case/:caseId/deliverRequestToCourt')
  @ApiOkResponse({
    type: DeliverResponse,
    description: 'Delivers a request to court',
  })
  deliverRequestToCourt(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Body() deliverDto: DeliverDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(`Delivering the request for case ${caseId} to court`)

    return this.internalCaseService.deliverRequestToCourt(
      theCase,
      deliverDto.user,
    )
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
    @Body() deliverDto: DeliverDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(`Delivering the court record for case ${caseId} to court`)

    return this.internalCaseService.deliverCourtRecordToCourt(
      theCase,
      deliverDto.user,
    )
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
    @Body() deliverDto: DeliverDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(`Delivering the court record for case ${caseId} to court`)

    return this.internalCaseService.deliverSignedRulingToCourt(
      theCase,
      deliverDto.user,
    )
  }

  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseCompletedGuard,
  )
  @Post('case/:caseId/deliverCaseConclusionToCourt')
  @ApiOkResponse({
    type: DeliverResponse,
    description: 'Delivers a case conclusion to court',
  })
  deliverCaseConclusionToCourt(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Body() deliverDto: DeliverDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Delivering the case conclusion for case ${caseId} to court`,
    )

    return this.internalCaseService.deliverCaseConclusionToCourt(
      theCase,
      deliverDto.user,
    )
  }

  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseCompletedGuard,
  )
  @Post('case/:caseId/deliverCaseToPolice')
  @ApiOkResponse({
    type: DeliverResponse,
    description: 'Delivers a completed case to police',
  })
  deliverCaseToPolice(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Body() deliverDto: DeliverDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(`Delivering case ${caseId} to police`)

    return this.internalCaseService.deliverCaseToPolice(
      theCase,
      deliverDto.user,
    )
  }

  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseCompletedGuard,
  )
  @Post('case/:caseId/deliverAppealToPolice')
  @ApiOkResponse({
    type: DeliverResponse,
    description: 'Delivers a completed appeal to police',
  })
  deliverAppealToPolice(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Body() deliverDto: DeliverDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(`Delivering appeal ${caseId} to police`)

    return this.internalCaseService.deliverAppealToPolice(
      theCase,
      deliverDto.user,
    )
  }
}
