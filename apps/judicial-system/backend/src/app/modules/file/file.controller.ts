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

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  CurrentHttpUser,
  JwtAuthUserGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import type { User } from '@island.is/judicial-system/types'
import {
  indictmentCases,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import {
  courtOfAppealsAssistantRule,
  courtOfAppealsJudgeRule,
  courtOfAppealsRegistrarRule,
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  prosecutorRepresentativeRule,
  prosecutorRule,
  publicProsecutorStaffRule,
} from '../../guards'
import {
  Case,
  CaseExistsGuard,
  CaseNotCompletedGuard,
  CaseReadGuard,
  CaseReceivedGuard,
  CaseTypeGuard,
  CaseWriteGuard,
  CurrentCase,
} from '../case'
import { MergedCaseExistsGuard } from '../case/guards/mergedCaseExists.guard'
import { CivilClaimantExistsGuard, DefendantExistsGuard } from '../defendant'
import { CreateFileDto } from './dto/createFile.dto'
import { CreatePresignedPostDto } from './dto/createPresignedPost.dto'
import { UpdateFilesDto } from './dto/updateFile.dto'
import { CurrentCaseFile } from './guards/caseFile.decorator'
import { CaseFileExistsGuard } from './guards/caseFileExists.guard'
import { CreateCivilClaimantCaseFileGuard } from './guards/createCivilClaimantCaseFile.guard'
import { CreateDefendantCaseFileGuard } from './guards/createDefendantCaseFile.guard'
import { ViewCaseFileGuard } from './guards/viewCaseFile.guard'
import { DeleteFileResponse } from './models/deleteFile.response'
import { CaseFile } from './models/file.model'
import { PresignedPost } from './models/presignedPost.model'
import { SignedUrl } from './models/signedUrl.model'
import { UploadFileToCourtResponse } from './models/uploadFileToCourt.response'
import { FileService } from './file.service'

@Controller('api/case/:caseId')
@ApiTags('files')
@UseGuards(JwtAuthUserGuard)
export class FileController {
  constructor(
    private readonly fileService: FileService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(RolesGuard, CaseExistsGuard, CaseWriteGuard)
  @RolesRules(
    prosecutorRule,
    prosecutorRepresentativeRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
    courtOfAppealsJudgeRule,
    courtOfAppealsRegistrarRule,
    courtOfAppealsAssistantRule,
    publicProsecutorStaffRule,
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

  @UseGuards(RolesGuard, CaseExistsGuard, CaseWriteGuard)
  @RolesRules(
    prosecutorRule,
    prosecutorRepresentativeRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
    courtOfAppealsJudgeRule,
    courtOfAppealsRegistrarRule,
    courtOfAppealsAssistantRule,
    publicProsecutorStaffRule,
  )
  @Post('file')
  @ApiCreatedResponse({
    type: CaseFile,
    description: 'Creates a new case file',
  })
  async createCaseFile(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @Body() createFile: CreateFileDto,
  ): Promise<CaseFile> {
    this.logger.debug(`Creating a file for case ${caseId}`)

    return this.fileService.createCaseFile(theCase, createFile, user)
  }

  // TODO: Add tests for this endpoint
  @UseGuards(
    RolesGuard,
    CaseExistsGuard,
    DefendantExistsGuard,
    CaseWriteGuard,
    CreateDefendantCaseFileGuard,
  )
  @RolesRules(publicProsecutorStaffRule)
  @Post('defendant/:defendantId/file')
  @ApiCreatedResponse({
    type: CaseFile,
    description: 'Creates a new case file connected to a defendant',
  })
  async createDefendantCaseFile(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @Body() createFile: CreateFileDto,
  ): Promise<CaseFile> {
    this.logger.debug(
      `Creating a file for case ${caseId} for defendant ${defendantId}`,
    )

    return this.fileService.createCaseFile(
      theCase,
      { ...createFile, defendantId },
      user,
    )
  }

  // TODO: Add tests for this endpoint
  @UseGuards(
    RolesGuard,
    CaseExistsGuard,
    CivilClaimantExistsGuard,
    CaseWriteGuard,
    CreateCivilClaimantCaseFileGuard,
  )
  @RolesRules() // This endpoint is not used by any role at the moment
  @Post('civilClaimant/:civilClaimantId/file')
  @ApiCreatedResponse({
    type: CaseFile,
    description: 'Creates a new case file connected to a civil claimant',
  })
  async createCivilClaimantCaseFile(
    @Param('caseId') caseId: string,
    @Param('civilClaimantId') civilClaimantId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @Body() createFile: CreateFileDto,
  ): Promise<CaseFile> {
    this.logger.debug(
      `Creating a file for case ${caseId} for civil claimant ${civilClaimantId}`,
    )

    return this.fileService.createCaseFile(
      theCase,
      { ...createFile, civilClaimantId },
      user,
    )
  }

  @UseGuards(
    RolesGuard,
    CaseExistsGuard,
    CaseReadGuard,
    MergedCaseExistsGuard,
    CaseFileExistsGuard,
    ViewCaseFileGuard,
  )
  @RolesRules(
    prosecutorRule,
    prosecutorRepresentativeRule,
    publicProsecutorStaffRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
    courtOfAppealsJudgeRule,
    courtOfAppealsRegistrarRule,
    courtOfAppealsAssistantRule,
  )
  @Get(['file/:fileId/url', 'mergedCase/:mergedCaseId/file/:fileId/url'])
  @ApiOkResponse({
    type: SignedUrl,
    description: 'Gets a signed url for a case file',
  })
  getCaseFileSignedUrl(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Param('fileId') fileId: string,
    @CurrentCaseFile() caseFile: CaseFile,
  ): Promise<SignedUrl> {
    this.logger.debug(
      `Getting a signed url for file ${fileId} of case ${caseId}`,
    )

    return this.fileService.getCaseFileSignedUrl(theCase, caseFile)
  }

  @UseGuards(RolesGuard, CaseExistsGuard, CaseWriteGuard, CaseFileExistsGuard)
  @RolesRules(
    prosecutorRule,
    prosecutorRepresentativeRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
    courtOfAppealsJudgeRule,
    courtOfAppealsRegistrarRule,
    courtOfAppealsAssistantRule,
  )
  @Delete('file/:fileId')
  @ApiOkResponse({
    type: DeleteFileResponse,
    description: 'Deletes a case file',
  })
  deleteCaseFile(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Param('fileId') fileId: string,
    @CurrentCaseFile() caseFile: CaseFile,
  ): Promise<DeleteFileResponse> {
    this.logger.debug(`Deleting file ${fileId} of case ${caseId}`)

    return this.fileService.deleteCaseFile(theCase, caseFile)
  }

  @UseGuards(
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseWriteGuard,
    CaseReceivedGuard,
    CaseFileExistsGuard,
  )
  @RolesRules(
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
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

    return this.fileService.uploadCaseFileToCourt(theCase, caseFile, user)
  }

  @UseGuards(
    RolesGuard,
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    CaseWriteGuard,
    CaseNotCompletedGuard,
  )
  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @Patch('files')
  @ApiOkResponse({
    type: CaseFile,
    isArray: true,
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
