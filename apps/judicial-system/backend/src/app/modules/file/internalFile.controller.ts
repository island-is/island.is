import { Controller, Inject, Param, Post, UseGuards } from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { TokenGuard } from '@island.is/judicial-system/auth'

import { Case, CaseExistsGuard, CurrentCase } from '../case'
import { CaseFileExistsGuard } from './guards/caseFileExists.guard'
import { CurrentCaseFile } from './guards/caseFile.decorator'
import { DeliverResponse } from './models/deliver.response'
import { CaseFile } from './models/file.model'
import { FileService } from './file.service'

@UseGuards(TokenGuard, CaseExistsGuard, CaseFileExistsGuard)
@Controller('api/internal/case/:caseId/file/:fileId')
@ApiTags('internal files')
export class InternalFileController {
  constructor(
    private readonly fileService: FileService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

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
  ): Promise<DeliverResponse> {
    this.logger.debug(`Delivering file ${fileId} of case ${caseId} to court`)

    const { success } = await this.fileService.uploadCaseFileToCourt(
      caseFile,
      theCase,
    )

    return { delivered: success }
  }
}
