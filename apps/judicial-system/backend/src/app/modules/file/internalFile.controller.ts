import { Controller, Get, Inject, Param, Post, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { CurrentHttpUser, TokenGuard } from '@island.is/judicial-system/auth'
import type { User } from '@island.is/judicial-system/types'

import { Case, CurrentCase, CaseExistsGuard, CaseReceivedGuard } from '../case'
import { CaseFileExistsGuard } from './guards/caseFileExists.guard'
import { CurrentCaseFile } from './guards/caseFile.decorator'
import { CaseFile } from './models/file.model'
import { UploadFileToCourtResponse } from './models/uploadFileToCourt.response'
import { FileService } from './file.service'

@UseGuards(TokenGuard)
@Controller('api/internal/case/:caseId')
@ApiTags('internal files')
export class InternalFileController {
  constructor(
    private readonly fileService: FileService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(CaseExistsGuard)
  @Get('files')
  @ApiOkResponse({
    type: CaseFile,
    isArray: true,
    description: 'Gets all existing case file',
  })
  getAllCaseFiles(@Param('caseId') caseId: string): Promise<CaseFile[]> {
    this.logger.debug(`Getting all files for case ${caseId}`)

    return this.fileService.getAllCaseFiles(caseId)
  }

  @UseGuards(CaseExistsGuard, CaseReceivedGuard, CaseFileExistsGuard)
  @Post('file/:fileId/court')
  @ApiOkResponse({
    type: UploadFileToCourtResponse,
    description: 'Uploads a case file to court',
  })
  uploadCaseFileToCourt(
    @Param('caseId') caseId: string,
    @Param('fileId') fileId: string,
    @CurrentCase() theCase: Case,
    @CurrentCaseFile() caseFile: CaseFile,
  ): Promise<UploadFileToCourtResponse> {
    this.logger.debug(`Uploading file ${fileId} of case ${caseId} to court`)

    return this.fileService.uploadCaseFileToCourt(
      user,
      caseFile,
      caseId,
      theCase.courtId,
      theCase.courtCaseNumber,
    )
  }
}
