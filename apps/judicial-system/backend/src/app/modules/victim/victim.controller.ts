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
  JwtAuthUserGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'

import { districtCourtJudgeRule, prosecutorRule } from '../../guards'
import { MinimalCaseExistsGuard } from '../case'
import { MinimalCurrentCase } from '../case/guards/minimalCase.decorator'
import { MinimalCaseAccessGuard } from '../case/guards/minimalCaseAccess.guard'
import { MinimalCase } from '../case/models/case.types'
import { CreateVictimDto } from './dto/createVictim.dto'
import { UpdateVictimDto } from './dto/updateVictim.dto'
import { ValidateVictimGuard } from './guards/validateVictim.guard'
import { CurrentVictim } from './guards/victim.decorator'
import { VictimWriteGuard } from './guards/victimWrite.guard'
import { Victim } from './models/victim.model'
import { VictimService } from './victim.service'

@Controller('api/case/:caseId/victim')
@ApiTags('victims')
@UseGuards(
  JwtAuthUserGuard,
  RolesGuard,
  MinimalCaseExistsGuard,
  MinimalCaseAccessGuard,
  ValidateVictimGuard,
)
export class VictimController {
  constructor(
    private readonly victimService: VictimService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(VictimWriteGuard)
  @RolesRules(prosecutorRule, districtCourtJudgeRule)
  @Post()
  @ApiCreatedResponse({
    type: Victim,
    description: 'Creates a new victim',
  })
  create(
    @Param('caseId') caseId: string,
    @MinimalCurrentCase() theCase: MinimalCase,
    @Body() createDto: CreateVictimDto,
  ): Promise<Victim> {
    this.logger.debug(`Creating victim for case ${caseId}`)

    return this.victimService.create(theCase.id, createDto)
  }

  @UseGuards(VictimWriteGuard)
  @RolesRules(prosecutorRule, districtCourtJudgeRule)
  @Patch(':victimId')
  @ApiOkResponse({
    type: Victim,
    description: 'Updates a victim',
  })
  updateVictim(
    @Param('caseId') caseId: string,
    @Param('victimId') victimId: string,
    @CurrentVictim() victim: Victim,
    @Body() dto: UpdateVictimDto,
  ): Promise<Victim> {
    this.logger.debug(`Updating victim ${victimId} of case ${caseId}`)
    return this.victimService.update(victimId, dto)
  }

  @UseGuards(VictimWriteGuard)
  @RolesRules(prosecutorRule, districtCourtJudgeRule)
  @Delete(':victimId')
  @ApiOkResponse({
    description: 'Deletes a victim by ID',
  })
  deleteVictim(
    @Param('caseId') caseId: string,
    @Param('victimId') victimId: string,
  ): Promise<void> {
    this.logger.debug(`Deleting victim ${victimId} of case ${caseId}`)
    return this.victimService.delete(victimId)
  }
}
