import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
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
  CaseReadGuard,
  CaseNotCompletedGuard,
  CaseOriginalAncestorInterceptor,
  CurrentCase,
} from '../case'
import { UploadPoliceCaseFileDto } from './dto'
import { PoliceCaseFile, UploadPoliceCaseFileResponse } from './models'
import { PoliceService } from './police.service'

@UseGuards(
  JwtAuthGuard,
  RolesGuard,
  CaseExistsGuard,
  CaseReadGuard,
  CaseNotCompletedGuard,
)
@Controller('api/case/:caseId')
@ApiTags('police files')
export class PoliceController {
  constructor(private readonly policeService: PoliceService) {}

  @RolesRules(prosecutorRule)
  @UseInterceptors(CaseOriginalAncestorInterceptor)
  @Get('policeFiles')
  @ApiOkResponse({
    type: PoliceCaseFile,
    isArray: true,
    description: 'Gets all police files for a case',
  })
  getAll(
    @Param('caseId') _0: string,
    @CurrentCase() theCase: Case,
  ): Promise<PoliceCaseFile[]> {
    return this.policeService.getAllPoliceCaseFiles(theCase.id)
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
