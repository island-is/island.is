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

import { prosecutorRepresentativeRule, prosecutorRule } from '../../guards'
import { getOrCreateTransaction } from '../../middleware'
import {
  CaseTypeGuard,
  MinimalCaseAccessGuard,
  MinimalCaseExistsForUpdateGuard,
} from '../case'
import { IndictmentCount, Offense } from '../repository'
import { CreateOffenseDto } from './dto/createOffense.dto'
import { ReorderIndictmentCountsDto } from './dto/reorderIndictmentCounts.dto'
import { UpdateIndictmentCountDto } from './dto/updateIndictmentCount.dto'
import { UpdateOffenseDto } from './dto/updateOffense.dto'
import { IndictmentCountExistsGuard } from './guards/indictmentCountExists.guard'
import { OffenseExistsGuard } from './guards/offenseExists.guard'
import { DeleteResponse } from './models/delete.response'
import { IndictmentCountService } from './indictmentCount.service'

// Every route mutates the case's indictment counts, so the class-level
// MinimalCaseExistsForUpdateGuard opens the request's transaction and reads
// the case row under FOR UPDATE. The handlers join that transaction with
// getOrCreateTransaction; a transaction of their own would wait on the row
// lock the guard already holds. RolesGuard goes first because every roles rule
// here is a bare role - indictmentCountRolesRules.spec.ts pins that - so an
// unauthorized caller is turned away before the lock is taken.
@Controller('api/case/:caseId')
@ApiTags('indictment-counts')
@UseGuards(
  JwtAuthUserGuard,
  RolesGuard,
  MinimalCaseExistsForUpdateGuard,
  new CaseTypeGuard(indictmentCases),
  MinimalCaseAccessGuard,
)
export class IndictmentCountController {
  constructor(
    private readonly indictmentCountService: IndictmentCountService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @Post('indictmentCount')
  @ApiCreatedResponse({
    type: IndictmentCount,
    description: 'Creates a new indictment count',
  })
  async create(@Param('caseId') caseId: string): Promise<IndictmentCount> {
    this.logger.debug(`Creating a new indictment count for case ${caseId}`)

    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.indictmentCountService.create(caseId, transaction)
  }

  @UseGuards(IndictmentCountExistsGuard)
  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @Patch('indictmentCount/:indictmentCountId')
  @ApiOkResponse({
    type: IndictmentCount,
    description: 'Updates an indictment count',
  })
  async update(
    @Param('caseId') caseId: string,
    @Param('indictmentCountId') indictmentCountId: string,
    @Body() indictmentCountToUpdate: UpdateIndictmentCountDto,
  ): Promise<IndictmentCount> {
    this.logger.debug(
      `Updating indictment count ${indictmentCountId} of case ${caseId}`,
    )

    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.indictmentCountService.update(
      caseId,
      indictmentCountId,
      indictmentCountToUpdate,
      transaction,
    )
  }

  @UseGuards(IndictmentCountExistsGuard)
  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @Delete('indictmentCount/:indictmentCountId')
  @ApiOkResponse({ description: 'Deletes an indictment count' })
  async delete(
    @Param('caseId') caseId: string,
    @Param('indictmentCountId') indictmentCountId: string,
  ): Promise<DeleteResponse> {
    this.logger.debug(
      `Deleting indictment count ${indictmentCountId} of case ${caseId}`,
    )

    const transaction = await getOrCreateTransaction(this.sequelize)

    const deleted = await this.indictmentCountService.delete(
      caseId,
      indictmentCountId,
      transaction,
    )

    return { deleted }
  }

  @UseGuards(IndictmentCountExistsGuard)
  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @Post('indictmentCount/:indictmentCountId/offense')
  @ApiCreatedResponse({
    type: Offense,
    description: 'Creates a new indictment count offense',
  })
  async createOffense(
    @Param('caseId') caseId: string,
    @Param('indictmentCountId') indictmentCountId: string,
    @Body() createOffenseDto: CreateOffenseDto,
  ): Promise<Offense> {
    this.logger.debug(
      `Creating a new offense for indictment count ${indictmentCountId} of case ${caseId}`,
    )

    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.indictmentCountService.createOffense(
      indictmentCountId,
      createOffenseDto.offense,
      { transaction },
    )
  }

  @UseGuards(IndictmentCountExistsGuard, OffenseExistsGuard)
  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @Patch('indictmentCount/:indictmentCountId/offense/:offenseId')
  @ApiOkResponse({
    type: Offense,
    description: 'Updates an offense',
  })
  async updateOffense(
    @Param('caseId') caseId: string,
    @Param('indictmentCountId') indictmentCountId: string,
    @Param('offenseId') offenseId: string,
    @Body() updatedOffense: UpdateOffenseDto,
  ): Promise<Offense> {
    this.logger.debug(
      `Updating an offense ${offenseId} for indictment count ${indictmentCountId} of case ${caseId}`,
    )

    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.indictmentCountService.updateOffense(
      indictmentCountId,
      offenseId,
      updatedOffense,
      { transaction },
    )
  }

  @UseGuards(IndictmentCountExistsGuard, OffenseExistsGuard)
  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @Delete('indictmentCount/:indictmentCountId/offense/:offenseId')
  @ApiOkResponse({ description: 'Deletes an offense' })
  async deleteOffense(
    @Param('caseId') caseId: string,
    @Param('indictmentCountId') indictmentCountId: string,
    @Param('offenseId') offenseId: string,
  ): Promise<DeleteResponse> {
    this.logger.debug(
      `Deleting an offense ${offenseId} for indictment count ${indictmentCountId} of case ${caseId}`,
    )

    const transaction = await getOrCreateTransaction(this.sequelize)

    const deleted = await this.indictmentCountService.deleteOffense(
      indictmentCountId,
      offenseId,
      { transaction },
    )

    return { deleted }
  }

  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @Patch('indictmentCounts/reorder')
  @ApiOkResponse({
    type: IndictmentCount,
    isArray: true,
    description: 'Reorders indictment counts',
  })
  async reorder(
    @Param('caseId') caseId: string,
    @Body() body: ReorderIndictmentCountsDto,
  ): Promise<IndictmentCount[]> {
    this.logger.debug(`Reordering the indictment counts of case ${caseId}`)

    const transaction = await getOrCreateTransaction(this.sequelize)

    return this.indictmentCountService.reorder(caseId, body.counts, transaction)
  }
}
