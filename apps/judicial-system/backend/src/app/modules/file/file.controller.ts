import { Request } from 'express'
import { Sequelize } from 'sequelize-typescript'

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  CurrentHttpUser,
  JwtAuthUserGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import { IDS_ACCESS_TOKEN_NAME } from '@island.is/judicial-system/consts'
import type { User } from '@island.is/judicial-system/types'
import {
  CaseFileCategory,
  CaseFileState,
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
  CaseExistsGuard,
  CaseNotCompletedGuard,
  CaseReadGuard,
  CaseReceivedGuard,
  CaseTypeGuard,
  CaseWriteGuard,
  CurrentCase,
} from '../case'
import { MergedCaseExistsGuard } from '../case/guards/mergedCaseExists.guard'
import {
  CivilClaimantExistsGuard,
  CurrentDefendant,
  DefendantExistsGuard,
} from '../defendant'
import { Case, CaseFile, Defendant } from '../repository'
import { CreateFileDto } from './dto/createFile.dto'
import { CreatePresignedPostDto } from './dto/createPresignedPost.dto'
import { UpdateFilesDto } from './dto/updateFile.dto'
import { CurrentCaseFile } from './guards/caseFile.decorator'
import { CaseFileExistsGuard } from './guards/caseFileExists.guard'
import { CreateCivilClaimantCaseFileGuard } from './guards/createCivilClaimantCaseFile.guard'
import { CreateDefendantCaseFileGuard } from './guards/createDefendantCaseFile.guard'
import { SplitCaseFileExistsGuard } from './guards/splitCaseFileExists.guard'
import { ViewCaseFileGuard } from './guards/viewCaseFile.guard'
import { DeleteFileResponse } from './models/deleteFile.response'
import { PresignedPost } from './models/presignedPost.model'
import { SignedUrl } from './models/signedUrl.model'
import { UploadCriminalRecordFileResponse } from './models/uploadCriminalRecordFile.response'
import { UploadFileToCourtResponse } from './models/uploadFileToCourt.response'
import { CriminalRecordService } from './criminalRecord.service'
import { FileService } from './file.service'

@Controller('api/case/:caseId')
@ApiTags('files')
@UseGuards(JwtAuthUserGuard, RolesGuard, CaseExistsGuard)
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly criminalRecordService: CriminalRecordService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(CaseWriteGuard)
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

  @UseGuards(CaseWriteGuard)
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

    return this.sequelize.transaction((transaction) =>
      this.fileService.createCaseFile(theCase, createFile, user, transaction),
    )
  }

  // TODO: Add tests for this endpoint
  @UseGuards(CaseWriteGuard, DefendantExistsGuard, CreateDefendantCaseFileGuard)
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

    return this.sequelize.transaction((transaction) =>
      this.fileService.createCaseFile(
        theCase,
        { ...createFile, defendantId },
        user,
        transaction,
      ),
    )
  }

  // TODO: Add tests for this endpoint
  @UseGuards(
    CaseWriteGuard,
    CivilClaimantExistsGuard,
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

    return this.sequelize.transaction((transaction) =>
      this.fileService.createCaseFile(
        theCase,
        { ...createFile, civilClaimantId },
        user,
        transaction,
      ),
    )
  }

  // Strictly speaking, only district court users need access to
  // split case files
  // However, giving prosecution and appeals court users access
  // does not pose a security risk
  @UseGuards(
    CaseReadGuard,
    MergedCaseExistsGuard,
    SplitCaseFileExistsGuard,
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

  @UseGuards(
    new CaseTypeGuard(indictmentCases),
    CaseWriteGuard,
    CaseFileExistsGuard,
  )
  @RolesRules(
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Post('file/:fileId/reject')
  @ApiOkResponse({
    type: CaseFile,
    description: 'Rejects a case file',
  })
  async rejectCaseFile(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
    @Param('fileId') fileId: string,
    @CurrentCaseFile() caseFile: CaseFile,
  ): Promise<CaseFile> {
    this.logger.debug(`Rejecting file ${fileId} of case ${caseId}`)

    if (caseFile.state === CaseFileState.REJECTED) {
      throw new BadRequestException('File is already rejected')
    }

    if (
      caseFile.category !== CaseFileCategory.PROSECUTOR_CASE_FILE &&
      caseFile.category !== CaseFileCategory.DEFENDANT_CASE_FILE &&
      caseFile.category !== CaseFileCategory.INDEPENDENT_DEFENDANT_CASE_FILE &&
      caseFile.category !==
        CaseFileCategory.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE &&
      caseFile.category !==
        CaseFileCategory.CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE
    ) {
      this.logger.error(
        `Attempt to reject case file ${fileId} of case ${caseId} with invalid category ${caseFile.category}`,
      )
      throw new BadRequestException(
        'Only uploaded prosecutor, defendant and civil claimant case files can be rejected',
      )
    }

    if (
      theCase.courtSessions?.some(
        (session) =>
          session.isConfirmed &&
          session.filedDocuments?.some((doc) => doc.caseFileId === caseFile.id),
      )
    ) {
      throw new BadRequestException(
        'Cannot reject a file that has been filed in a court session',
      )
    }

    return this.sequelize.transaction(async (transaction) =>
      this.fileService.rejectCaseFile(theCase, caseFile, transaction),
    )
  }

  @UseGuards(CaseWriteGuard, CaseFileExistsGuard)
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

    return this.sequelize.transaction((transaction) =>
      this.fileService.updateFiles(caseId, updateFiles.files, transaction),
    )
  }

  // TODO: Add tests for this endpoint
  @UseGuards(CaseWriteGuard, DefendantExistsGuard)
  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @Post('defendant/:defendantId/criminalRecordFile')
  @ApiCreatedResponse({
    type: UploadCriminalRecordFileResponse,
    description:
      'Uploads the latest criminal record file for defendant to the national commissioner office',
  })
  async uploadCriminalRecordFile(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @Req() req: Request,
    @CurrentHttpUser() user: User,
    @CurrentDefendant() defendant: Defendant,
    @CurrentCase() theCase: Case,
  ): Promise<UploadCriminalRecordFileResponse> {
    this.logger.debug(
      `Uploading the latest criminal record file for defendant ${defendantId} of case ${caseId} to S3`,
    )

    const accessToken = req.cookies[IDS_ACCESS_TOKEN_NAME]
    if (!accessToken) {
      throw new UnauthorizedException('Missing access token in session')
    }

    return this.criminalRecordService.uploadCriminalRecordFile({
      caseType: theCase.type,
      accessToken,
      defendant,
      user,
    })
  }
}
