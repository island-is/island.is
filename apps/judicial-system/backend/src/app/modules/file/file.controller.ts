import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
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
import {
  indictmentCases,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'
import type { User } from '@island.is/judicial-system/types'

import {
  judgeRule,
  prosecutorRule,
  registrarRule,
  representativeRule,
  assistantRule,
} from '../../guards'
import {
  Case,
  CaseNotCompletedGuard,
  CurrentCase,
  CaseExistsGuard,
  CaseReadGuard,
  CaseReceivedGuard,
  CaseWriteGuard,
  CaseTypeGuard,
} from '../case'
import { CaseFileExistsGuard } from './guards/caseFileExists.guard'
import { CurrentCaseFile } from './guards/caseFile.decorator'
import { ViewCaseFileGuard } from './guards/viewCaseFile.guard'
import { defenderFileRule } from './guards/rolesRules'
import { CreateFileDto } from './dto/createFile.dto'
import { CreatePresignedPostDto } from './dto/createPresignedPost.dto'
import { UpdateFilesDto } from './dto/updateFile.dto'
import { PresignedPost } from './models/presignedPost.model'
import { CaseFile } from './models/file.model'
import { DeleteFileResponse } from './models/deleteFile.response'
import { SignedUrl } from './models/signedUrl.model'
import { UploadFileToCourtResponse } from './models/uploadFileToCourt.response'
import { FileService } from './file.service'

@UseGuards(JwtAuthGuard)
@Controller('api/case/:caseId')
@ApiTags('files')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(RolesGuard, CaseExistsGuard, CaseWriteGuard, CaseNotCompletedGuard)
  @RolesRules(
    prosecutorRule,
    representativeRule,
    registrarRule,
    judgeRule,
    assistantRule,
  )
  @Post('file/url')
  @ApiCreatedResponse({
    type: PresignedPost,
    description: 'Creates a new presigned post',
  })
  createPresignedPost(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Body() createPresignedPost: CreatePresignedPostDto,
  ): Promise<PresignedPost> {
    this.logger.debug(`Creating a presigned post for case ${caseId}`)

    return this.fileService.createPresignedPost(theCase, createPresignedPost)
  }

  @UseGuards(RolesGuard, CaseExistsGuard, CaseWriteGuard, CaseNotCompletedGuard)
  @RolesRules(
    prosecutorRule,
    representativeRule,
    registrarRule,
    judgeRule,
    assistantRule,
  )
  @Post('file')
  @ApiCreatedResponse({
    type: CaseFile,
    description: 'Creates a new case file',
  })
  async createCaseFile(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Body() createFile: CreateFileDto,
  ): Promise<CaseFile> {
    this.logger.debug(`Creating a file for case ${caseId}`)

    return this.fileService.createCaseFile(theCase, createFile)
  }

  @UseGuards(
    CaseFileExistsGuard,
    RolesGuard,
    CaseExistsGuard,
    CaseReadGuard,
    ViewCaseFileGuard,
  )
  @RolesRules(
    prosecutorRule,
    representativeRule,
    judgeRule,
    registrarRule,
    assistantRule,
    defenderFileRule,
  )
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
    RolesGuard,
    CaseExistsGuard,
    CaseWriteGuard,
    CaseNotCompletedGuard,
    CaseFileExistsGuard,
  )
  @RolesRules(prosecutorRule, representativeRule, registrarRule, judgeRule)
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
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
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

    return this.fileService.uploadCaseFileToCourt(caseFile, theCase, user)
  }

  @UseGuards(
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    CaseWriteGuard,
    CaseNotCompletedGuard,
  )
  @RolesRules(prosecutorRule, representativeRule)
  @Patch('files')
  @ApiOkResponse({
    type: Boolean,
    description: 'Updates multiple files of the case',
  })
  updateFiles(
    @Param('caseId') caseId: string,
    @Body() updateFiles: UpdateFilesDto,
  ): Promise<CaseFile[]> {
    this.logger.debug(`Updating files of case ${caseId}`, { updateFiles })

    return this.fileService.updateFiles(caseId, updateFiles.files)
  }
}
