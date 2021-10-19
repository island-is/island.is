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
  UserRole,
  CaseState,
  completedCaseStates,
  courtRoles,
} from '@island.is/judicial-system/types'
import type { User } from '@island.is/judicial-system/types'

import { judgeRule, prosecutorRule, registrarRule } from '../../guards'
import { Case, CaseService } from '../case'
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
  constructor(
    private readonly fileService: FileService,
    private readonly caseService: CaseService,
  ) {}

  private doesUserHavePermissionToViewCaseFiles(
    user: User,
    existingCase: Case,
  ): boolean {
    // Prosecutors have permission to view all case files
    if (user.role === UserRole.PROSECUTOR) {
      return true
    }

    // Judges have permission to view files of completed cases, and
    // of uncompleted received cases they have been assigned to
    if (user.role === UserRole.JUDGE) {
      return (
        completedCaseStates.includes(existingCase.state) ||
        (existingCase.state === CaseState.RECEIVED &&
          user.id === existingCase.judgeId)
      )
    }

    // Registrars have permission to view files of completed cases
    if (user.role === UserRole.REGISTRAR) {
      return completedCaseStates.includes(existingCase.state)
    }

    // Other users do not have permission to view any case files
    return false
  }

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
  @Post('file/url')
  @ApiCreatedResponse({
    type: PresignedPost,
    description: 'Creates a new presigned post',
  })
  async createCasePresignedPost(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @Body() createPresignedPost: CreatePresignedPostDto,
  ): Promise<PresignedPost> {
    const existingCase = await this.caseService.findByIdAndUser(caseId, user)

    if (completedCaseStates.includes(existingCase.state)) {
      throw new ForbiddenException('Files cannot be added to a completed case')
    }

    return this.fileService.createCasePresignedPost(
      existingCase.id,
      createPresignedPost,
    )
  }

  @RolesRules(prosecutorRule)
  @Post('file')
  @ApiCreatedResponse({
    type: CaseFile,
    description: 'Creates a new case file',
  })
  async createCaseFile(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @Body() createFile: CreateFileDto,
  ): Promise<CaseFile> {
    const existingCase = await this.caseService.findByIdAndUser(caseId, user)

    if (completedCaseStates.includes(existingCase.state)) {
      throw new ForbiddenException('Files cannot be added to a completed case')
    }

    return this.fileService.createCaseFile(existingCase.id, createFile)
  }

  @RolesRules(prosecutorRule, judgeRule, registrarRule)
  @Get('files')
  @ApiOkResponse({
    type: CaseFile,
    isArray: true,
    description: 'Gets all existing case file',
  })
  async getAllCaseFiles(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
  ): Promise<CaseFile[]> {
    const existingCase = await this.caseService.findByIdAndUser(
      caseId,
      user,
      false,
    )

    return this.fileService.getAllCaseFiles(existingCase.id)
  }

  @RolesRules(prosecutorRule)
  @Delete('file/:id')
  @ApiOkResponse({
    type: DeleteFileResponse,
    description: 'Deletes a case file',
  })
  async deleteCaseFile(
    @Param('caseId') caseId: string,
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
  ): Promise<DeleteFileResponse> {
    const existingCase = await this.caseService.findByIdAndUser(caseId, user)

    if (completedCaseStates.includes(existingCase.state)) {
      throw new ForbiddenException(
        'Files cannot be deleted from a completed case',
      )
    }

    const file = await this.fileService.findById(id, existingCase.id)

    if (!file) {
      throw new NotFoundException(
        `File ${id} of case ${existingCase.id} does not exist`,
      )
    }

    return this.fileService.deleteCaseFile(existingCase.id, file)
  }

  @RolesRules(prosecutorRule, judgeRule, registrarRule)
  @Get('file/:id/url')
  @ApiOkResponse({
    type: PresignedPost,
    description: 'Gets a signed url for a case file',
  })
  async getCaseFileSignedUrl(
    @Param('caseId') caseId: string,
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
  ): Promise<SignedUrl> {
    const existingCase = await this.caseService.findByIdAndUser(
      caseId,
      user,
      false,
    )

    if (!this.doesUserHavePermissionToViewCaseFiles(user, existingCase)) {
      throw new ForbiddenException(
        `User ${user.id} does not have permission to view files of case ${existingCase.id}`,
      )
    }

    const file = await this.fileService.findById(id, existingCase.id)

    if (!file) {
      throw new NotFoundException(
        `File ${id} of case ${existingCase.id} does not exist`,
      )
    }

    return this.fileService.getCaseFileSignedUrl(existingCase.id, file)
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
    const existingCase = await this.caseService.findByIdAndUser(
      caseId,
      user,
      true,
    )

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
