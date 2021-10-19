import { Controller, Get, UseGuards } from '@nestjs/common'
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
import { PoliceCaseFile } from './policeCaseFile.model'
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
  async getAll(@CurrentCase() theCase: Case): Promise<PoliceCaseFile[]> {
    return this.policeService.getAllPoliceCaseFiles(theCase.id)
  }
}
