import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import {
  CurrentHttpUser,
  JwtAuthGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import {
  completedCaseStates,
  courtRoles,
} from '@island.is/judicial-system/types'
import type { User } from '@island.is/judicial-system/types'

import { judgeRule, prosecutorRule, registrarRule } from '../../guards'
import {
  Case,
  CaseExistsForUpdateGuard,
  CaseNotCompletedGuard,
  CurrentCase,
  CaseService,
  CaseExistsGuard,
} from '../case'
import { CreateFileDto, CreatePresignedPostDto } from './dto'
import {
  PresignedPost,
  CaseFile,
  DeleteFileResponse,
  SignedUrl,
  UploadFileToCourtResponse,
} from './models'
import { FileService } from './file.service'
import {
  CaseFileExistsGuard,
  CurrentCaseFile,
  ViewCaseFileGuard,
} from './guards'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/case/:caseId')
@ApiTags('files')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly caseService: CaseService,
  ) {}

  private doesUserHavePermissionToUploadCaseFilesToCourt(
    user: User,
    existingCase: Case,
  ): boolean {
    // Judges and registrars have permission to upload files of completed cases
    return (
      courtRoles.includes(user.role) &&
      completedCaseStates.includes(existingCase.state)
    )
  }

  @RolesRules(prosecutorRule)
  @UseGuards(CaseExistsForUpdateGuard, CaseNotCompletedGuard)
  @Post('file/url')
  @ApiCreatedResponse({
    type: PresignedPost,
    description: 'Creates a new presigned post',
  })
  createPresignedPost(
    @CurrentCase() theCase: Case,
    @Body() createPresignedPost: CreatePresignedPostDto,
  ): Promise<PresignedPost> {
    return this.fileService.createPresignedPost(theCase.id, createPresignedPost)
  }

  @RolesRules(prosecutorRule)
  @UseGuards(CaseExistsForUpdateGuard, CaseNotCompletedGuard)
  @Post('file')
  @ApiCreatedResponse({
    type: CaseFile,
    description: 'Creates a new case file',
  })
  async createCaseFile(
    @CurrentCase() theCase: Case,
    @Body() createFile: CreateFileDto,
  ): Promise<CaseFile> {
    return this.fileService.createCaseFile(theCase.id, createFile)
  }

  @RolesRules(prosecutorRule, judgeRule, registrarRule)
  @UseGuards(CaseExistsGuard)
  @Get('files')
  @ApiOkResponse({
    type: CaseFile,
    isArray: true,
    description: 'Gets all existing case file',
  })
  async getAllCaseFiles(@CurrentCase() theCase: Case): Promise<CaseFile[]> {
    return this.fileService.getAllCaseFiles(theCase.id)
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
  async deleteCaseFile(
    @CurrentCaseFile() caseFile: CaseFile,
  ): Promise<DeleteFileResponse> {
    return this.fileService.deleteCaseFile(caseFile)
  }

  @RolesRules(prosecutorRule, judgeRule, registrarRule)
  @UseGuards(CaseExistsGuard, ViewCaseFileGuard)
  @Get('file/:fileId/url')
  @ApiOkResponse({
    type: PresignedPost,
    description: 'Gets a signed url for a case file',
  })
  async getCaseFileSignedUrl(
    @CurrentCaseFile() caseFile: CaseFile,
  ): Promise<SignedUrl> {
    return this.fileService.getCaseFileSignedUrl(caseFile)
  }

  @RolesRules(judgeRule, registrarRule)
  @Post('file/:id/court')
  @ApiOkResponse({
    type: PresignedPost,
    description: 'Uploads a case file to court',
  })
  async uploadCaseFileToCourt(
    @Param('caseId') caseId: string,
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
  ): Promise<UploadFileToCourtResponse> {
    const existingCase = await this.caseService.findByIdAndUser(caseId, user)

    if (
      !this.doesUserHavePermissionToUploadCaseFilesToCourt(user, existingCase)
    ) {
      throw new ForbiddenException(
        `User ${user.id} does not have permission to upload files of case ${existingCase.id} to court`,
      )
    }

    const file = await this.fileService.findById(id, existingCase.id)

    if (!file) {
      throw new NotFoundException(
        `File ${id} of case ${existingCase.id} does not exist`,
      )
    }

    return this.fileService.uploadCaseFileToCourt(
      existingCase.id,
      existingCase.courtId,
      existingCase.courtCaseNumber,
      file,
    )
  }
}
