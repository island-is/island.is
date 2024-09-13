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

import { JwtAuthGuard, RolesGuard } from '@island.is/judicial-system/auth'

import { Case, CaseExistsGuard, CurrentCase } from '../case'
import { CreateCivilClaimantDto } from './dto/createCivilClaimant.dto'
import { UpdateCivilClaimantDto } from './dto/updateCivilClaimant.dto'
import { CurrentDefendant } from './guards/defendant.decorator'
import { CivilClaimant } from './models/civilClaimant.model'
import { Defendant } from './models/defendant.model'
import { CivilClaimantService } from './civildClaimant.service'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/case/:caseId/defendant/:defendantId/civilClaimant')
@ApiTags('civilClaimants')
export class CivilClaimantController {
  constructor(
    private readonly civilClaimantService: CivilClaimantService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(CaseExistsGuard)
  @Post()
  @ApiCreatedResponse({
    type: CivilClaimant,
    description: 'Civil claimant created',
  })
  async create(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @Body() createCivilClaimantDto: CreateCivilClaimantDto,
  ): Promise<CivilClaimant> {
    this.logger.debug(
      `Creating a new civil claimant for defendant ${defendantId} in case ${caseId}`,
    )

    return this.civilClaimantService.create(
      theCase,
      defendant,
      createCivilClaimantDto,
    )
  }

  @UseGuards(CaseExistsGuard)
  @Patch(':civilClaimantId')
  @ApiOkResponse({
    type: CivilClaimant,
    description: 'Civil claimant updated',
  })
  async update(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @Param('civilClaimantId') civilClaimantId: string,
    @Body() updateCivilClaimantDto: UpdateCivilClaimantDto,
  ): Promise<CivilClaimant> {
    this.logger.debug(
      `Updating civil claimant ${civilClaimantId} for defendant ${defendantId} in case ${caseId}`,
    )
    return this.civilClaimantService.update(
      civilClaimantId,
      updateCivilClaimantDto,
    )
  }

  @UseGuards(CaseExistsGuard)
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
