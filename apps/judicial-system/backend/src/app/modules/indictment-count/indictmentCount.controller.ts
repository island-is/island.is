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

import { prosecutorRepresentativeRule, prosecutorRule } from '../../guards'
import { IndictmentCount, Offense } from '..//repository'
import { MinimalCaseAccessGuard, MinimalCaseExistsGuard } from '../case'
import { CreateOffenseDto } from './dto/createOffense.dto'
import { UpdateIndictmentCountDto } from './dto/updateIndictmentCount.dto'
import { UpdateOffenseDto } from './dto/updateOffense.dto'
import { IndictmentCountExistsGuard } from './guards/indictmentCountExists.guard'
import { OffenseExistsGuard } from './guards/offenseExists.guard'
import { DeleteResponse } from './models/delete.response'
import { IndictmentCountService } from './indictmentCount.service'

@Controller('api/case/:caseId/indictmentCount')
@ApiTags('indictment-counts')
@UseGuards(JwtAuthUserGuard, RolesGuard)
export class IndictmentCountController {
  constructor(
    private readonly indictmentCountService: IndictmentCountService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(MinimalCaseExistsGuard, MinimalCaseAccessGuard)
  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @Post()
  @ApiCreatedResponse({
    type: IndictmentCount,
    description: 'Creates a new indictment count',
  })
  create(@Param('caseId') caseId: string): Promise<IndictmentCount> {
    this.logger.debug(`Creating a new indictment count for case ${caseId}`)

    return this.indictmentCountService.create(caseId)
  }

  @UseGuards(
    MinimalCaseExistsGuard,
    MinimalCaseAccessGuard,
    IndictmentCountExistsGuard,
  )
  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @Patch(':indictmentCountId')
  @ApiOkResponse({
    type: IndictmentCount,
    description: 'Updates an indictment count',
  })
  update(
    @Param('caseId') caseId: string,
    @Param('indictmentCountId') indictmentCountId: string,
    @Body() indictmentCountToUpdate: UpdateIndictmentCountDto,
  ): Promise<IndictmentCount> {
    this.logger.debug(
      `Updating indictment count ${indictmentCountId} of case ${caseId}`,
    )

    return this.indictmentCountService.update(
      caseId,
      indictmentCountId,
      indictmentCountToUpdate,
    )
  }

  @UseGuards(
    MinimalCaseExistsGuard,
    MinimalCaseAccessGuard,
    IndictmentCountExistsGuard,
  )
  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @Delete(':indictmentCountId')
  @ApiOkResponse({ description: 'Deletes an indictment count' })
  async delete(
    @Param('caseId') caseId: string,
    @Param('indictmentCountId') indictmentCountId: string,
  ): Promise<DeleteResponse> {
    this.logger.debug(
      `Deleting indictment count ${indictmentCountId} of case ${caseId}`,
    )

    const deleted = await this.indictmentCountService.delete(
      caseId,
      indictmentCountId,
    )

    return { deleted }
  }

  @UseGuards(
    MinimalCaseExistsGuard,
    MinimalCaseAccessGuard,
    IndictmentCountExistsGuard,
  )
  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @Post(':indictmentCountId/offense')
  @ApiCreatedResponse({
    type: Offense,
    description: 'Creates a new indictment count offense',
  })
  createOffense(
    @Param('caseId') caseId: string,
    @Param('indictmentCountId') indictmentCountId: string,
    @Body() createOffenseDto: CreateOffenseDto,
  ): Promise<Offense> {
    this.logger.debug(
      `Creating a new offense for indictment count ${indictmentCountId} of case ${caseId}`,
    )

    return this.indictmentCountService.createOffense(
      indictmentCountId,
      createOffenseDto.offense,
    )
  }

  @UseGuards(
    MinimalCaseExistsGuard,
    MinimalCaseAccessGuard,
    IndictmentCountExistsGuard,
    OffenseExistsGuard,
  )
  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @Patch(':indictmentCountId/offense/:offenseId')
  @ApiOkResponse({
    type: Offense,
    description: 'Updates an offense',
  })
  updateOffense(
    @Param('caseId') caseId: string,
    @Param('indictmentCountId') indictmentCountId: string,
    @Param('offenseId') offenseId: string,
    @Body() updatedOffense: UpdateOffenseDto,
  ): Promise<Offense> {
    this.logger.debug(
      `Updating an offense ${offenseId} for indictment count ${indictmentCountId} of case ${caseId}`,
    )

    return this.indictmentCountService.updateOffense(
      indictmentCountId,
      offenseId,
      updatedOffense,
    )
  }

  @UseGuards(
    MinimalCaseExistsGuard,
    MinimalCaseAccessGuard,
    IndictmentCountExistsGuard,
    OffenseExistsGuard,
  )
  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @Delete(':indictmentCountId/offense/:offenseId')
  @ApiOkResponse({ description: 'Deletes an offense' })
  async deleteOffense(
    @Param('caseId') caseId: string,
    @Param('indictmentCountId') indictmentCountId: string,
    @Param('offenseId') offenseId: string,
  ): Promise<DeleteResponse> {
    this.logger.debug(
      `Deleting an offense ${offenseId} for indictment count ${indictmentCountId} of case ${caseId}`,
    )

    const deleted = await this.indictmentCountService.deleteOffense(
      indictmentCountId,
      offenseId,
    )

    return { deleted }
  }
}
