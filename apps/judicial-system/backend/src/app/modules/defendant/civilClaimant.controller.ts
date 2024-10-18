import {
  Body,
  Controller,
  Delete,
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
  JwtAuthGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'

import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  prosecutorRepresentativeRule,
  prosecutorRule,
} from '../../guards'
import { Case, CaseExistsGuard, CaseWriteGuard, CurrentCase } from '../case'
import { UpdateCivilClaimantDto } from './dto/updateCivilClaimant.dto'
import { CivilClaimant } from './models/civilClaimant.model'
import { DeleteCivilClaimantResponse } from './models/deleteCivilClaimant.response'
import { CivilClaimantService } from './civilClaimant.service'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/case/:caseId/civilClaimant')
@ApiTags('civilClaimants')
export class CivilClaimantController {
  constructor(
    private readonly civilClaimantService: CivilClaimantService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(CaseExistsGuard, CaseWriteGuard)
  @RolesRules(
    prosecutorRule,
    prosecutorRepresentativeRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Post()
  @ApiCreatedResponse({
    type: CivilClaimant,
    description: 'Civil claimant created',
  })
  async create(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,
  ): Promise<CivilClaimant> {
    this.logger.debug(`Creating a new civil claimant for case ${caseId}`)

    return this.civilClaimantService.create(theCase)
  }

  @UseGuards(CaseExistsGuard, CaseWriteGuard)
  @RolesRules(
    prosecutorRule,
    prosecutorRepresentativeRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Patch(':civilClaimantId')
  @ApiOkResponse({
    type: CivilClaimant,
    description: 'Civil claimant updated',
  })
  async update(
    @Param('caseId') caseId: string,
    @Param('civilClaimantId') civilClaimantId: string,
    @Body() updateCivilClaimantDto: UpdateCivilClaimantDto,
  ): Promise<CivilClaimant> {
    this.logger.debug(
      `Updating civil claimant ${civilClaimantId} in case ${caseId}`,
    )
    return this.civilClaimantService.update(
      caseId,
      civilClaimantId,
      updateCivilClaimantDto,
    )
  }

  @UseGuards(CaseExistsGuard, CaseWriteGuard)
  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @Delete(':civilClaimantId')
  @ApiOkResponse({
    type: DeleteCivilClaimantResponse,
    description: 'Civil claimant deleted',
  })
  async delete(
    @Param('caseId') caseId: string,
    @Param('civilClaimantId') civilClaimantId: string,
  ): Promise<DeleteCivilClaimantResponse> {
    this.logger.debug(`Deleting civil claimant ${civilClaimantId}`)

    const deleted = await this.civilClaimantService.delete(
      caseId,
      civilClaimantId,
    )

    return { deleted }
  }
}
