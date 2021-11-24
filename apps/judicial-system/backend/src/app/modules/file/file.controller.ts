import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import {
  JwtAuthGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'

import { judgeRule, prosecutorRule, registrarRule } from '../../guards'
import {
  Case,
  CaseExistsForUpdateGuard,
  CaseNotCompletedGuard,
  CurrentCase,
  CaseExistsGuard,
  CaseCompletedGuard,
} from '../case'
import {
  CaseFileExistsGuard,
  CurrentCaseFile,
  ViewCaseFileGuard,
} from './guards'
import { CreateFileDto, CreatePresignedPostDto } from './dto'
import {
  PresignedPost,
  CaseFile,
  DeleteFileResponse,
  SignedUrl,
  UploadFileToCourtResponse,
} from './models'
import { FileService } from './file.service'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/case/:caseId')
@ApiTags('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @RolesRules(prosecutorRule)
  @UseGuards(CaseExistsForUpdateGuard, CaseNotCompletedGuard)
  @Post('file/url')
  @ApiCreatedResponse({
    type: PresignedPost,
    description: 'Creates a new presigned post',
  })
  createPresignedPost(
    @Param('caseId') caseId: string,
    @Body() createPresignedPost: CreatePresignedPostDto,
  ): Promise<PresignedPost> {
    return this.fileService.createPresignedPost(caseId, createPresignedPost)
  }

  @RolesRules(prosecutorRule)
  @UseGuards(CaseExistsForUpdateGuard, CaseNotCompletedGuard)
  @Post('file')
  @ApiCreatedResponse({
    type: CaseFile,
    description: 'Creates a new case file',
  })
  async createCaseFile(
    @Param('caseId') caseId: string,
    @Body() createFile: CreateFileDto,
  ): Promise<CaseFile> {
    return this.fileService.createCaseFile(caseId, createFile)
  }

  @RolesRules(prosecutorRule, judgeRule, registrarRule)
  @UseGuards(CaseExistsGuard)
  @Get('files')
  @ApiOkResponse({
    type: CaseFile,
    isArray: true,
    description: 'Gets all existing case file',
  })
  getAllCaseFiles(@Param('caseId') caseId: string): Promise<CaseFile[]> {
    return this.fileService.getAllCaseFiles(caseId)
  }

  @RolesRules(prosecutorRule)
  @UseGuards(
    CaseExistsForUpdateGuard,
    CaseNotCompletedGuard,
    CaseFileExistsGuard,
  )
  @Delete('file/:fileId')
  @ApiOkResponse({
    type: DeleteFileResponse,
    description: 'Deletes a case file',
  })
  deleteCaseFile(
    @Param('caseId') _0: string,
    @Param('fileId') _1: string,
    @CurrentCaseFile() caseFile: CaseFile,
  ): Promise<DeleteFileResponse> {
    return this.fileService.deleteCaseFile(caseFile)
  }

  @RolesRules(prosecutorRule, judgeRule, registrarRule)
  @UseGuards(CaseExistsGuard, ViewCaseFileGuard, CaseFileExistsGuard)
  @Get('file/:fileId/url')
  @ApiOkResponse({
    type: PresignedPost,
    description: 'Gets a signed url for a case file',
  })
  getCaseFileSignedUrl(
    @Param('caseId') _0: string,
    @Param('fileId') _1: string,
    @CurrentCaseFile() caseFile: CaseFile,
  ): Promise<SignedUrl> {
    return this.fileService.getCaseFileSignedUrl(caseFile)
  }

  @RolesRules(judgeRule, registrarRule)
  @UseGuards(CaseExistsForUpdateGuard, CaseCompletedGuard, CaseFileExistsGuard)
  @Post('file/:fileId/court')
  @ApiOkResponse({
    type: UploadFileToCourtResponse,
    description: 'Uploads a case file to court',
  })
  uploadCaseFileToCourt(
    @Param('caseId') _0: string,
    @Param('fileId') _1: string,
    @CurrentCase() theCase: Case,
    @CurrentCaseFile() caseFile: CaseFile,
  ): Promise<UploadFileToCourtResponse> {
    return this.fileService.uploadCaseFileToCourt(
      theCase.courtId,
      theCase.courtCaseNumber,
      caseFile,
    )
  }
}
