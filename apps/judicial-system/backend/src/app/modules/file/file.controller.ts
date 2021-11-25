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
  CaseNotCompletedGuard,
  CurrentCase,
  CaseExistsGuard,
  CaseReadGuard,
  CaseCompletedGuard,
  CaseWriteGuard,
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
    return this.fileService.getAllCaseFiles(caseId)
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
    @Param('caseId') _0: string,
    @Param('fileId') _1: string,
    @CurrentCaseFile() caseFile: CaseFile,
  ): Promise<DeleteFileResponse> {
    return this.fileService.deleteCaseFile(caseFile)
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
    @Param('caseId') _0: string,
    @Param('fileId') _1: string,
    @CurrentCaseFile() caseFile: CaseFile,
  ): Promise<SignedUrl> {
    return this.fileService.getCaseFileSignedUrl(caseFile)
  }

  @UseGuards(
    CaseExistsGuard,
    CaseWriteGuard,
    CaseCompletedGuard,
    CaseFileExistsGuard,
  )
  @RolesRules(judgeRule, registrarRule)
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
