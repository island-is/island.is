import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  JwtAuthGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'

import { defenderRule } from '../../guards'
import { LimitedAccessCaseExistsGuard, CaseDefenderGuard } from '../case'
import { CaseFileExistsGuard } from './guards/caseFileExists.guard'
import { ViewCaseFileGuard } from './guards/viewCaseFile.guard'
import { CurrentCaseFile } from './guards/caseFile.decorator'
import { CaseFile } from './models/file.model'
import { SignedUrl } from './models/signedUrl.model'
import { FileService } from './file.service'

@UseGuards(JwtAuthGuard)
@Controller('api/case/:caseId/limitedAccess')
@ApiTags('files')
export class LimitedAccessFileController {
  constructor(
    private readonly fileService: FileService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(
    RolesGuard,
    LimitedAccessCaseExistsGuard,
    CaseDefenderGuard,
    CaseFileExistsGuard,
    ViewCaseFileGuard,
  )
  @RolesRules(defenderRule)
  @Get('file/:fileId/url')
  @ApiOkResponse({
    type: SignedUrl,
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
}
