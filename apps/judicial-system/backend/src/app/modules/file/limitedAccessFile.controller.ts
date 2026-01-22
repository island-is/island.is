import { Sequelize } from 'sequelize-typescript'

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
import type { User } from '@island.is/judicial-system/types'
import {
  indictmentCases,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

import { defenderRule, prisonSystemStaffRule } from '../../guards'
import {
  CaseCompletedGuard,
  CaseReadGuard,
  CaseTypeGuard,
  CaseWriteGuard,
  CurrentCase,
  LimitedAccessCaseExistsGuard,
} from '../case'
import { MergedCaseExistsGuard } from '../case/guards/mergedCaseExists.guard'
import { CivilClaimantExistsGuard } from '../defendant'
import { Case, CaseFile } from '../repository'
import { CreateFileDto } from './dto/createFile.dto'
import { CreatePresignedPostDto } from './dto/createPresignedPost.dto'
import { CurrentCaseFile } from './guards/caseFile.decorator'
import { CaseFileExistsGuard } from './guards/caseFileExists.guard'
import { CreateCivilClaimantCaseFileGuard } from './guards/createCivilClaimantCaseFile.guard'
import { LimitedAccessViewCaseFileGuard } from './guards/limitedAccessViewCaseFile.guard'
import { LimitedAccessWriteCaseFileGuard } from './guards/limitedAccessWriteCaseFile.guard'
import { DeleteFileResponse } from './models/deleteFile.response'
import { PresignedPost } from './models/presignedPost.model'
import { SignedUrl } from './models/signedUrl.model'
import { FileService } from './file.service'

@Controller('api/case/:caseId/limitedAccess')
@ApiTags('files')
@UseGuards(JwtAuthUserGuard, RolesGuard, LimitedAccessCaseExistsGuard)
export class LimitedAccessFileController {
  constructor(
    private readonly fileService: FileService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(
    new CaseTypeGuard([
      ...restrictionCases,
      ...investigationCases,
      ...indictmentCases,
    ]),
    CaseWriteGuard,
  )
  @RolesRules(defenderRule)
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

  @UseGuards(
    new CaseTypeGuard([
      ...restrictionCases,
      ...investigationCases,
      ...indictmentCases,
    ]),
    CaseWriteGuard,
    LimitedAccessWriteCaseFileGuard,
  )
  @RolesRules(defenderRule)
  @Post('file')
  @ApiCreatedResponse({
    type: CaseFile,
    description: 'Creates a new case file',
  })
  createCaseFile(
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

  // This endpoint is not used by any role at the moment
  // Before using the endpoint we should probably change
  // the createCaseFile endpoint to createDefendantCaseFile and
  // limit file creation to defendant's and spokesperson's clients
  @UseGuards(
    new CaseTypeGuard([...indictmentCases]),
    CaseWriteGuard,
    CivilClaimantExistsGuard,
    LimitedAccessWriteCaseFileGuard,
    CreateCivilClaimantCaseFileGuard,
  )
  @RolesRules()
  @Post('civilClaimant/:civilClaimantId/file')
  @ApiCreatedResponse({
    type: CaseFile,
    description: 'Creates a new case file for a civil claimant',
  })
  createCivilClaimantCaseFile(
    @Param('caseId') caseId: string,
    @Param('civilClaimantId') civilClaimantId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @Body() createFile: CreateFileDto,
  ): Promise<CaseFile> {
    this.logger.debug(
      `Creating a file for case ${caseId} and civil claimant ${civilClaimantId}`,
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

  @UseGuards(
    CaseReadGuard,
    MergedCaseExistsGuard,
    CaseFileExistsGuard,
    LimitedAccessViewCaseFileGuard,
  )
  @RolesRules(prisonSystemStaffRule, defenderRule)
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
    new CaseTypeGuard([...restrictionCases, ...investigationCases]),
    CaseWriteGuard,
    CaseCompletedGuard,
    CaseFileExistsGuard,
    LimitedAccessWriteCaseFileGuard,
  )
  @RolesRules(defenderRule)
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
}
