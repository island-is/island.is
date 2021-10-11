import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import {
  CurrentHttpUser,
  JwtAuthGuard,
  RolesGuard,
  RolesRule,
  RolesRules,
} from '@island.is/judicial-system/auth'
import { UserRole } from '@island.is/judicial-system/types'
import type { User } from '@island.is/judicial-system/types'

import { PoliceService } from './police.service'
import { CaseService } from '../case'
import { PoliceCaseFile } from './policeFile.model'

// Allows prosecutors to perform any action
const prosecutorRule = UserRole.PROSECUTOR as RolesRule

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/case/:caseId')
@ApiTags('police files')
export class PoliceController {
  constructor(
    private readonly policeService: PoliceService,
    private readonly caseService: CaseService,
  ) {}

  @RolesRules(prosecutorRule)
  @Get('policeFiles')
  @ApiOkResponse({
    type: PoliceCaseFile,
    isArray: true,
    description: 'Gets all existing police case file',
  })
  async getAllCaseFiles(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
  ): Promise<PoliceCaseFile[]> {
    const existingCase = await this.caseService.findByIdAndUser(
      caseId,
      user,
      false,
    )

    return this.policeService.getAllPoliceCaseFiles(existingCase.id)
  }
}
