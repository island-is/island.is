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
import { indictmentCases } from '@island.is/judicial-system/types'

import {
  Case,
  CaseExistsGuard,
  CaseHasExistedGuard,
  CaseTypeGuard,
  CurrentCase,
} from '../case'
import { DeliverDto } from './dto/deliver.dto'
import { CurrentCaseFile } from './guards/caseFile.decorator'
import { CaseFileExistsGuard } from './guards/caseFileExists.guard'
import { DeliverResponse } from './models/deliver.response'
import { CaseFile } from './models/file.model'
import { FileService } from './file.service'

@UseGuards(TokenGuard)
@Controller('api/internal/case/:caseId/file/:fileId')
@ApiTags('internal files')
export class InternalFileController {
  constructor(
    private readonly fileService: FileService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(CaseExistsGuard, CaseFileExistsGuard)
  @Post('deliverToCourt')
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
      caseFile,
      theCase,
      deliverDto.user,
    )

    return { delivered: success }
  }

  @UseGuards(
    CaseHasExistedGuard,
    new CaseTypeGuard(indictmentCases),
    CaseFileExistsGuard,
  )
  @Post('archive')
  @ApiCreatedResponse({
    type: DeliverResponse,
    description: 'Archives a case file',
  })
  async archiveCaseFile(
    @Param('caseId') caseId: string,
    @Param('fileId') fileId: string,
    @CurrentCaseFile() caseFile: CaseFile,
  ): Promise<DeliverResponse> {
    this.logger.debug(`Archiving file ${fileId} of case ${caseId}`)

    const success = await this.fileService.archive(caseFile)

    return { delivered: success }
  }
}
