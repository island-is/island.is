import { Sequelize } from 'sequelize-typescript'

import {
  Body,
  Controller,
  Inject,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  JwtAuthUserGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import { indictmentCases } from '@island.is/judicial-system/types'

import { prosecutorRepresentativeRule, prosecutorRule } from '../../guards'
import {
  CaseTypeGuard,
  MinimalCaseAccessGuard,
  MinimalCaseExistsGuard,
} from '../case'
import { IndictmentCount } from '../repository'
import { ReorderIndictmentCountsDto } from './dto/reorderIndictmentCounts.dto'
import { IndictmentCountService } from './indictmentCount.service'

@Controller('api/case/:caseId')
@ApiTags('indictment-counts')
@UseGuards(
  JwtAuthUserGuard,
  RolesGuard,
  MinimalCaseExistsGuard,
  new CaseTypeGuard(indictmentCases),
  MinimalCaseAccessGuard,
)
export class IndictmentCountsController {
  constructor(
    private readonly indictmentCountService: IndictmentCountService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @Patch('indictmentCounts/reorder')
  @ApiOkResponse({
    type: IndictmentCount,
    isArray: true,
    description: 'Reorders indictment counts',
  })
  reorder(
    @Param('caseId') caseId: string,
    @Body() body: ReorderIndictmentCountsDto,
  ): Promise<IndictmentCount[]> {
    return this.sequelize.transaction((transaction) =>
      this.indictmentCountService.reorder(caseId, body.counts, transaction),
    )
  }
}
