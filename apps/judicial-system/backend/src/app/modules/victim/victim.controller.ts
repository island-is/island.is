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

import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  prosecutorRule,
} from '../../guards'
import {
  MinimalCase,
  MinimalCaseAccessGuard,
  MinimalCaseExistsGuard,
  MinimalCurrentCase,
} from '../case'
import { Victim } from '../repository'
import { CreateVictimDto } from './dto/createVictim.dto'
import { UpdateVictimDto } from './dto/updateVictim.dto'
import { ValidateVictimGuard } from './guards/validateVictim.guard'
import { CurrentVictim } from './guards/victim.decorator'
import { VictimWriteGuard } from './guards/victimWrite.guard'
import { DeleteVictimResponse } from './models/deleteVictim.response'
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
  @RolesRules(prosecutorRule)
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
  @RolesRules(
    prosecutorRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Patch(':victimId')
  @ApiOkResponse({
    type: Victim,
    description: 'Updates a victim',
  })
  update(
    @Param('caseId') caseId: string,
    @Param('victimId') victimId: string,
    @CurrentVictim() victim: Victim,
    @MinimalCurrentCase() theCase: MinimalCase,
    @Body() dto: UpdateVictimDto,
  ): Promise<Victim> {
    this.logger.debug(`Updating victim ${victimId} of case ${caseId}`)
    return this.victimService.update(theCase.id, victim.id, dto)
  }

  @UseGuards(VictimWriteGuard)
  @RolesRules(prosecutorRule)
  @Delete(':victimId')
  @ApiOkResponse({
    type: DeleteVictimResponse,
    description: 'Deletes a single victim for a given case',
  })
  async delete(
    @Param('caseId') caseId: string,
    @Param('victimId') victimId: string,
    @MinimalCurrentCase() theCase: MinimalCase,
    @CurrentVictim() victim: Victim,
  ): Promise<DeleteVictimResponse> {
    this.logger.debug(`Deleting victim ${victimId} of case ${caseId}`)

    const deleted = await this.victimService.delete(theCase.id, victim.id)

    return { deleted }
  }
}
