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
  CurrentHttpUser,
  JwtAuthGuard,
  RolesGuard,
  RolesRule,
  RolesRules,
} from '@island.is/judicial-system/auth'
import { SignedUrl, User, UserRole } from '@island.is/judicial-system/types'

import { CaseService } from '../case'
import { CreateFileDto, CreatePresignedPostDto } from './dto'
import { PresignedPost, File, DeleteFileResponse } from './models'
import { FileService } from './file.service'

// Allows prosecutors to perform any action
const prosecutorRule = UserRole.PROSECUTOR as RolesRule

// Allows judges to perform any action
const judgeRule = UserRole.JUDGE as RolesRule

// Allows registrars to perform any action
const registrarRule = UserRole.REGISTRAR as RolesRule

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/case/:caseId')
@ApiTags('files')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly caseService: CaseService,
  ) {}

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

    return this.fileService.createCasePresignedPost(
      existingCase.id,
      createPresignedPost,
    )
  }

  @RolesRules(prosecutorRule, judgeRule)
  @Get('file/:id/url')
  @ApiCreatedResponse({
    type: PresignedPost,
    description: 'Creates a new presigned post',
  })
  async getSignedUrl(
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
  ): Promise<SignedUrl> {
    const file = await this.fileService.getCaseFileById(id)

    const hasPermissionToDelete = await this.caseService.findByIdAndUser(
      file.caseId,
      user,
    )

    if (hasPermissionToDelete) {
      return this.fileService.getSignedUrl(file.key)
    }
  }

  @RolesRules(prosecutorRule)
  @Delete('file/:id')
  @ApiCreatedResponse({
    type: DeleteFileResponse,
    description: 'Deletes a file from an AWS S3 bucket',
  })
  async deleteFile(
    @Param('caseId') caseId: string,
    @Param('id') id: string,
    @CurrentHttpUser() user: User,
  ): Promise<DeleteFileResponse> {
    const file = await this.fileService.getCaseFileById(id)
    const hasPermissionToDelete = await this.caseService.findByIdAndUser(
      caseId,
      user,
    )

    if (hasPermissionToDelete) {
      return this.fileService.deleteFile(file)
    }
  }

  @RolesRules(prosecutorRule)
  @Post('file')
  @ApiCreatedResponse({
    type: File,
    description: 'Creates a new file',
  })
  async createCaseFile(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @Body() createFile: CreateFileDto,
  ): Promise<File> {
    const existingCase = await this.caseService.findByIdAndUser(caseId, user)

    return this.fileService.createCaseFile(existingCase.id, createFile)
  }

  @RolesRules(prosecutorRule, judgeRule, registrarRule)
  @Get('files')
  @ApiOkResponse({
    type: File,
    isArray: true,
    description: 'Gets all existing files for an existing case',
  })
  async getAllCaseFiles(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
  ): Promise<File[]> {
    const existingCase = await this.caseService.findByIdAndUser(caseId, user)

    return this.fileService.getAllCaseFiles(existingCase.id)
  }
}
