import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import {
  JwtAuthGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'

import { prosecutorRule } from '../../guards'
import {
  Case,
  CaseExistsGuard,
  CaseNotCompletedGuard,
  CurrentCase,
} from '../case'
import { PoliceCaseFile, UploadPoliceCaseFileResponse } from './models'
import { PoliceService } from './police.service'

@UseGuards(JwtAuthGuard, RolesGuard, CaseExistsGuard, CaseNotCompletedGuard)
@Controller('api/case/:caseId')
@ApiTags('police files')
export class PoliceController {
  constructor(private readonly policeService: PoliceService) {}

  @RolesRules(prosecutorRule)
  @Get('policeFiles')
  @ApiOkResponse({
    type: PoliceCaseFile,
    isArray: true,
    description: 'Gets all police files for a case',
  })
  getAll(@CurrentCase() theCase: Case): Promise<PoliceCaseFile[]> {
    return this.policeService.getAllPoliceCaseFiles(theCase.id)
  }

  @RolesRules(prosecutorRule)
  @Post('policeFile/:policeFileId')
  @ApiOkResponse({
    type: UploadPoliceCaseFileResponse,
    description: 'Uploads a police files of a case to AWS S3',
  })
  uploadPoliceCaseFile(
    @Param('policeFileId') policeFileId: string,
  ): Promise<UploadPoliceCaseFileResponse> {
    return this.policeService.uploadPoliceCaseFile(policeFileId)
  }
}
