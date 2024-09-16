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

import { prosecutorRepresentativeRule, prosecutorRule } from '../../guards'
import { Case, CaseExistsGuard, CaseWriteGuard, CurrentCase } from '../case'
import { CreateCivilClaimantDto } from './dto/createCivilClaimant.dto'
import { UpdateCivilClaimantDto } from './dto/updateCivilClaimant.dto'
import { CivilClaimant } from './models/civilClaimant.model'
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
  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @Post()
  @ApiCreatedResponse({
    type: CivilClaimant,
    description: 'Civil claimant created',
  })
  async create(
    @Param('caseId') caseId: string,
    @CurrentCase() theCase: Case,

    @Body() createCivilClaimantDto: CreateCivilClaimantDto,
  ): Promise<CivilClaimant> {
    this.logger.debug(`Creating a new civil claimant for case ${caseId}`)

    return this.civilClaimantService.create(theCase, createCivilClaimantDto)
  }

  @UseGuards(CaseExistsGuard, CaseWriteGuard)
  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
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
      civilClaimantId,
      updateCivilClaimantDto,
    )
  }

  @UseGuards(CaseExistsGuard, CaseWriteGuard)
  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @Delete(':civilClaimantId')
  @ApiOkResponse({
    type: CivilClaimant,
    description: 'Civil claimant deleted',
  })
  async remove(
    @Param('civilClaimantId') civilClaimantId: string,
  ): Promise<void> {
    this.logger.debug(`Deleting civil claimant ${civilClaimantId}`)

    return this.civilClaimantService.remove(civilClaimantId)
  }
}
