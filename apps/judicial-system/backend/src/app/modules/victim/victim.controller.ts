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
import { investigationCases } from '@island.is/judicial-system/types'

import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  prosecutorRule,
} from '../../guards'
import { getOrCreateTransaction } from '../../middleware'
import {
  CaseTypeGuard,
  MinimalCase,
  MinimalCaseExistsForUpdateGuard,
  MinimalCaseWriteGuard,
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

// Every route mutates the case's victims, so the class-level
// MinimalCaseExistsForUpdateGuard opens the request's transaction and reads
// the case row under FOR UPDATE. The handlers join that transaction with
// getOrCreateTransaction; a transaction of their own would wait on the row
// lock the guard already holds. RolesGuard goes first because every roles rule
// here is a bare role - victimRolesRules.spec.ts pins that - so an
// unauthorized caller is turned away before the lock is taken.
@Controller('api/case/:caseId/victim')
@ApiTags('victims')
@UseGuards(
  JwtAuthUserGuard,
  RolesGuard,
  MinimalCaseExistsForUpdateGuard,
  new CaseTypeGuard(investigationCases),
  MinimalCaseWriteGuard,
  ValidateVictimGuard,
  VictimWriteGuard,
)
export class VictimController {
  constructor(
    private readonly victimService: VictimService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @RolesRules(prosecutorRule)
  @Post()
  @ApiCreatedResponse({
    type: Victim,
    description: 'Creates a new victim',
  })
  async create(
    @Param('caseId') caseId: string,
    @MinimalCurrentCase() theCase: MinimalCase,
    @Body() createDto: CreateVictimDto,
  ): Promise<Victim> {
    this.logger.debug(`Creating victim for case ${caseId}`)

    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.victimService.create(theCase.id, createDto, { transaction })
  }

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
  async update(
    @Param('caseId') caseId: string,
    @Param('victimId') victimId: string,
    @CurrentVictim() victim: Victim,
    @MinimalCurrentCase() theCase: MinimalCase,
    @Body() dto: UpdateVictimDto,
  ): Promise<Victim> {
    this.logger.debug(`Updating victim ${victimId} of case ${caseId}`)

    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.victimService.update(theCase.id, victim.id, dto, {
      transaction,
    })
  }

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

    const transaction = await getOrCreateTransaction(this.sequelize)

    const deleted = await this.victimService.delete(theCase.id, victim.id, {
      transaction,
    })

    return { deleted }
  }
}
