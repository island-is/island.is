import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  CurrentHttpUser,
  JwtAuthGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import type { User } from '@island.is/judicial-system/types'

import { judgeRule, prosecutorRule, registrarRule } from '../../guards'
import {
  Case,
  CaseNotCompletedGuard,
  CurrentCase,
  CaseExistsGuard,
  CaseReadGuard,
  CaseReceivedGuard,
  CaseWriteGuard,
} from '../case'
import { CaseFileExistsGuard } from './guards/caseFileExists.guard'
import { CurrentCaseFile } from './guards/caseFile.decorator'
import { ViewCaseFileGuard } from './guards/viewCaseFile.guard'
import { CreateFileDto } from './dto/createFile.dto'
import { CreatePresignedPostDto } from './dto/createPresignedPost.dto'
import { PresignedPost } from './models/presignedPost.model'
import { CaseFile } from './models/file.model'
import { DeleteFileResponse } from './models/deleteFile.response'
import { SignedUrl } from './models/signedUrl.model'
import { UploadFileToCourtResponse } from './models/uploadFileToCourt.response'
import { FileService } from './file.service'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/case/:caseId')
@ApiTags('files')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(CaseExistsGuard, CaseWriteGuard, CaseNotCompletedGuard)
  @RolesRules(prosecutorRule)
  @Post('file/url')
  @ApiCreatedResponse({
    type: PresignedPost,
    description: 'Creates a new presigned post',
  })
  createPresignedPost(
    @Param('caseId') caseId: string,
    @Body() createPresignedPost: CreatePresignedPostDto,
  ): Promise<PresignedPost> {
    this.logger.debug(`Creating a presigned post for case ${caseId}`)

    return this.fileService.createPresignedPost(caseId, createPresignedPost)
  }

  @UseGuards(CaseExistsGuard, CaseWriteGuard, CaseNotCompletedGuard)
  @RolesRules(prosecutorRule)
  @Post('file')
  @ApiCreatedResponse({
    type: CaseFile,
    description: 'Creates a new case file',
  })
  async createCaseFile(
    @Param('caseId') caseId: string,
    @Body() createFile: CreateFileDto,
  ): Promise<CaseFile> {
    this.logger.debug(`Creating a file for case ${caseId}`)

    return this.fileService.createCaseFile(caseId, createFile)
  }

  @UseGuards(CaseExistsGuard, CaseReadGuard)
  @RolesRules(prosecutorRule, judgeRule, registrarRule)
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

  @UseGuards(
    CaseExistsGuard,
    CaseReadGuard,
    ViewCaseFileGuard,
    CaseFileExistsGuard,
  )
  @RolesRules(prosecutorRule, judgeRule, registrarRule)
  @Get('file/:fileId/url')
  @ApiOkResponse({
    type: PresignedPost,
    description: 'Gets a signed url for a case file',
  })
  getCaseFileSignedUrl(
    @Param('caseId') caseId: string,
    @Param('fileId') fileId: string,
    @CurrentCaseFile() caseFile: CaseFile,
  ): Promise<SignedUrl> {
    this.logger.debug(
      `Getting a signed url for file ${fileId} of case ${caseId}`,
    )

    return this.fileService.getCaseFileSignedUrl(caseFile)
  }

  @UseGuards(
    CaseExistsGuard,
    CaseWriteGuard,
    CaseNotCompletedGuard,
    CaseFileExistsGuard,
  )
  @RolesRules(prosecutorRule)
  @Delete('file/:fileId')
  @ApiOkResponse({
    type: DeleteFileResponse,
    description: 'Deletes a case file',
  })
  deleteCaseFile(
    @Param('caseId') caseId: string,
    @Param('fileId') fileId: string,
    @CurrentCaseFile() caseFile: CaseFile,
  ): Promise<DeleteFileResponse> {
    this.logger.debug(`Deleting file ${fileId} of case ${caseId}`)

    return this.fileService.deleteCaseFile(caseFile)
  }

  @UseGuards(
    CaseExistsGuard,
    CaseWriteGuard,
    CaseReceivedGuard,
    CaseFileExistsGuard,
  )
  @RolesRules(judgeRule, registrarRule)
  @Post('file/:fileId/court')
  @ApiOkResponse({
    type: UploadFileToCourtResponse,
    description: 'Uploads a case file to court',
  })
  uploadCaseFileToCourt(
    @Param('caseId') caseId: string,
    @Param('fileId') fileId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @CurrentCaseFile() caseFile: CaseFile,
  ): Promise<UploadFileToCourtResponse> {
    this.logger.debug(`Uploading file ${fileId} of case ${caseId} to court`)

    return this.fileService.uploadCaseFileToCourt(
      caseFile,
      caseId,
      theCase.courtId,
      theCase.courtCaseNumber,
      user,
    )
  }
}
