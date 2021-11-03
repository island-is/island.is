import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import {
  JwtAuthGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'

import { prosecutorRule } from '../../guards'
import { CaseExistsGuard, CaseNotCompletedGuard } from '../case'
import { UploadPoliceCaseFileDto } from './dto'
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
  getAll(@Param('caseId') caseId: string): Promise<PoliceCaseFile[]> {
    return this.policeService.getAllPoliceCaseFiles(caseId)
  }

  @RolesRules(prosecutorRule)
  @Post('policeFile')
  @ApiOkResponse({
    type: UploadPoliceCaseFileResponse,
    description: 'Uploads a police files of a case to AWS S3',
  })
  uploadPoliceCaseFile(
    @Param('caseId') caseId: string,
    @Body() uploadPoliceCaseFile: UploadPoliceCaseFileDto,
  ): Promise<UploadPoliceCaseFileResponse> {
    return this.policeService.uploadPoliceCaseFile(caseId, uploadPoliceCaseFile)
  }
}
