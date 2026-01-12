import {
  Body,
  Controller,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { TokenGuard } from '@island.is/judicial-system/auth'
import {
  messageEndpoint,
  MessageType,
} from '@island.is/judicial-system/message'

import { CaseExistsGuard, CurrentCase } from '../case'
import { Case, CaseFile } from '../repository'
import { DeliverDto } from './dto/deliver.dto'
import { CurrentCaseFile } from './guards/caseFile.decorator'
import { SplitCaseFileExistsGuard } from './guards/splitCaseFileExists.guard'
import { DeliverResponse } from './models/deliver.response'
import { FileService } from './file.service'

@Controller('api/internal/case/:caseId')
@ApiTags('internal files')
@UseGuards(TokenGuard, CaseExistsGuard, SplitCaseFileExistsGuard)
export class InternalFileController {
  constructor(
    private readonly fileService: FileService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  // TODO: Add tests for this endpoint
  @Post(`${messageEndpoint[MessageType.DELIVERY_TO_POLICE_CASE_FILE]}/:fileId`)
  @ApiCreatedResponse({
    type: DeliverResponse,
    description: 'Delivers a case file to police',
  })
  deliverCaseFileToPolice(
    @Param('caseId') caseId: string,
    @Param('fileId') fileId: string,
    @CurrentCase() theCase: Case,
    @CurrentCaseFile() caseFile: CaseFile,
    @Body() deliverDto: DeliverDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(`Delivering file ${fileId} of case ${caseId} to police`)

    return this.fileService.deliverCaseFileToPolice(
      theCase,
      caseFile,
      deliverDto.user,
    )
  }

  @Post(`${messageEndpoint[MessageType.DELIVERY_TO_COURT_CASE_FILE]}/:fileId`)
  @ApiCreatedResponse({
    type: DeliverResponse,
    description: 'Delivers a case file to court',
  })
  async deliverCaseFileToCourt(
    @Param('caseId') caseId: string,
    @Param('fileId') fileId: string,
    @CurrentCase() theCase: Case,
    @CurrentCaseFile() caseFile: CaseFile,
    @Body() deliverDto: DeliverDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(`Delivering file ${fileId} of case ${caseId} to court`)

    const { success } = await this.fileService.uploadCaseFileToCourt(
      theCase,
      caseFile,
      deliverDto.user,
    )

    return { delivered: success }
  }

  @Post(
    `${
      messageEndpoint[MessageType.DELIVERY_TO_COURT_OF_APPEALS_CASE_FILE]
    }/:fileId`,
  )
  @ApiCreatedResponse({
    type: DeliverResponse,
    description: 'Delivers a case file to court of appeals',
  })
  deliverCaseFileToCourtOfAppeals(
    @Param('caseId') caseId: string,
    @Param('fileId') fileId: string,
    @CurrentCase() theCase: Case,
    @CurrentCaseFile() caseFile: CaseFile,
    @Body() deliverDto: DeliverDto,
  ): Promise<DeliverResponse> {
    this.logger.debug(
      `Delivering file ${fileId} of case ${caseId} to court of appeals`,
    )

    return this.fileService.deliverCaseFileToCourtOfAppeals(
      theCase,
      caseFile,
      deliverDto.user,
    )
  }
}
