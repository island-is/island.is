import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  CurrentHttpUser,
  JwtAuthUserGuard,
  RolesGuard,
} from '@island.is/judicial-system/auth'

import { CaseWriteGuard, MinimalCaseExistsGuard } from '../case'
import { MinimalCurrentCase } from '../case/guards/minimalCase.decorator'
import { MinimalCase } from '../case/models/case.types'
import { CreateVictimDto } from './dto/createVictim.dto'
import { UpdateVictimDto } from './dto/updateVictim.dto'
import { Victim } from './victim.model'
import { VictimService } from './victim.service'

@Controller('api/case/:caseId/victim')
@ApiTags('victims')
@UseGuards(JwtAuthUserGuard, RolesGuard, MinimalCaseExistsGuard)
export class VictimController {
  constructor(
    private readonly victimService: VictimService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(CaseWriteGuard)
  @Get()
  @ApiOkResponse({
    type: Victim,
    isArray: true,
    description: 'Gets all victims for a case',
  })
  @ApiParam({ name: 'caseId', type: String })
  getVictimsByCase(@Param('caseId') caseId: string): Promise<Victim[]> {
    this.logger.debug(`Getting victims for case ${caseId}`)
    return this.victimService.findByCaseId(caseId)
  }

  @UseGuards(CaseWriteGuard)
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

  @UseGuards(CaseWriteGuard)
  @Patch(':victimId')
  @ApiOkResponse({
    type: Victim,
    description: 'Updates a victim',
  })
  @ApiParam({ name: 'caseId', type: String })
  @ApiParam({ name: 'victimId', type: String })
  updateVictim(
    @Param('caseId') caseId: string,
    @Param('victimId') victimId: string,
    @Body() dto: UpdateVictimDto,
  ): Promise<Victim> {
    this.logger.debug(`Updating victim ${victimId}`)
    return this.victimService.update(victimId, dto)
  }

  @UseGuards(CaseWriteGuard)
  @Delete(':victimId')
  @ApiOkResponse({
    description: 'Deletes a victim by ID',
  })
  @ApiParam({ name: 'caseId', type: String })
  @ApiParam({ name: 'victimId', type: String })
  deleteVictim(@Param('victimId') victimId: string): Promise<void> {
    this.logger.debug(`Deleting victim ${victimId}`)
    return this.victimService.delete(victimId)
  }
}
