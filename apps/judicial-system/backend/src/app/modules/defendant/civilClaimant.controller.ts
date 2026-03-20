import { Sequelize } from 'sequelize-typescript'

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
import { InjectConnection } from '@nestjs/sequelize'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  JwtAuthUserGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  prosecutorRepresentativeRule,
  prosecutorRule,
} from '../../guards'
import {
  CaseExistsGuard,
  CaseTypeGuard,
  CaseWriteGuard,
  CurrentCase,
} from '../case'
import { Case, CivilClaimant } from '../repository'
import { UpdateCivilClaimantDto } from './dto/updateCivilClaimant.dto'
import { CurrentCivilClaimant } from './guards/civilClaimaint.decorator'
import { CivilClaimantExistsGuard } from './guards/civilClaimantExists.guard'
import { DeleteCivilClaimantResponse } from './models/deleteCivilClaimant.response'
import { CivilClaimantService } from './civilClaimant.service'

@Controller('api/case/:caseId/civilClaimant')
@ApiTags('civilClaimants')
@UseGuards(
  JwtAuthUserGuard,
  RolesGuard,
  CaseExistsGuard,
  new CaseTypeGuard(indictmentCases),
  CaseWriteGuard,
)
export class CivilClaimantController {
  constructor(
    private readonly civilClaimantService: CivilClaimantService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

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

    return this.sequelize.transaction((transaction) =>
      this.civilClaimantService.create(theCase, transaction),
    )
  }

  @UseGuards(CivilClaimantExistsGuard)
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
    @CurrentCivilClaimant() civilClaimant: CivilClaimant,
    @Body() updateCivilClaimantDto: UpdateCivilClaimantDto,
  ): Promise<CivilClaimant> {
    this.logger.debug(
      `Updating civil claimant ${civilClaimantId} of case ${caseId}`,
    )
    return this.civilClaimantService.update(
      caseId,
      civilClaimant,
      updateCivilClaimantDto,
    )
  }

  @UseGuards(CivilClaimantExistsGuard)
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
    this.logger.debug(
      `Deleting civil claimant ${civilClaimantId} of case ${caseId}`,
    )

    const deleted = await this.civilClaimantService.delete(
      caseId,
      civilClaimantId,
    )

    return { deleted }
  }
}
