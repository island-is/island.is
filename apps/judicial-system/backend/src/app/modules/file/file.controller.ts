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
  RolesRule,
  RolesRules,
} from '@island.is/judicial-system/auth'
import {
  UserRole,
  CaseState,
  CaseAppealDecision,
  hasCaseBeenAppealed,
  completedCaseStates,
} from '@island.is/judicial-system/types'
import type { User, Case as TCase } from '@island.is/judicial-system/types'

import { Case, CaseService } from '../case'
import { CreateFileDto, CreatePresignedPostDto } from './dto'
import {
  PresignedPost,
  CaseFile,
  DeleteFileResponse,
  SignedUrl,
} from './models'
import { FileService } from './file.service'

// Allows prosecutors to perform any action
const prosecutorRule = UserRole.PROSECUTOR as RolesRule

// Allows judges to perform any action
const judgeRule = UserRole.JUDGE as RolesRule

// Allows registrars to perform any action
const registrarRule = UserRole.REGISTRAR as RolesRule

const sevenDays = 7 * 24 * 60 * 60 * 1000

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/case/:caseId')
@ApiTags('files')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly caseService: CaseService,
  ) {}

  private getAppealDate(existingCase: Case): Date {
    // Assumption: case has been appealed and the appeal date is in the past

    // If either party appealed in court, then use the ruling date
    if (
      existingCase.prosecutorAppealDecision === CaseAppealDecision.APPEAL ||
      existingCase.accusedAppealDecision === CaseAppealDecision.APPEAL
    ) {
      return existingCase.rulingDate as Date // We should have date
    }

    // Otherwise, use the earliest postponed appeal date
    const prosecutorPostponedAppealDate =
      existingCase.prosecutorPostponedAppealDate ?? new Date()
    const accusedPostponedAppealDate =
      existingCase.accusedPostponedAppealDate ?? new Date()

    return prosecutorPostponedAppealDate < accusedPostponedAppealDate
      ? prosecutorPostponedAppealDate
      : accusedPostponedAppealDate
  }

  private isLessThanSevenDaysAfterAppealDate(existingCase: Case): boolean {
    const appealDate = this.getAppealDate(existingCase)

    return Date.now() < appealDate.getTime() + sevenDays
  }

  private doesUserHavePermissionToViewCaseFiles(
    user: User,
    existingCase: Case,
  ): boolean {
    // Prosecutors have permission to view all case files
    if (user.role === UserRole.PROSECUTOR) {
      return true
    }

    // Judges have permission to view files of appealed cases for 7 days, and
    // of uncompleted received cases they have been assigned to
    if (user.role === UserRole.JUDGE) {
      return (
        (hasCaseBeenAppealed((existingCase as unknown) as TCase) &&
          this.isLessThanSevenDaysAfterAppealDate(existingCase)) ||
        (existingCase.state === CaseState.RECEIVED &&
          user.id === existingCase.judgeId)
      )
    }

    // Registrars have permission to view files of appealed cases for 7 days
    if (user.role === UserRole.REGISTRAR) {
      return (
        hasCaseBeenAppealed((existingCase as unknown) as TCase) &&
        this.isLessThanSevenDaysAfterAppealDate(existingCase)
      )
    }

    // Other users do not have permission to view any case files
    return false
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
    description: 'Creates a new file',
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
    description: 'Gets all existing files for an existing case',
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
    description: 'Deletes a file',
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

    const file = await this.fileService.findById(id)

    if (!file || file.caseId !== existingCase.id) {
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
    description: 'Gets a signed url for an existing file',
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

    const file = await this.fileService.findById(id)

    if (!file || file.caseId !== existingCase.id) {
      throw new NotFoundException(
        `File ${id} of case ${existingCase.id} does not exist`,
      )
    }

    return this.fileService.getCaseFileSignedUrl(existingCase.id, file)
  }
}
