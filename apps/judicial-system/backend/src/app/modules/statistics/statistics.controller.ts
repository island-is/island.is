import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  CurrentHttpUser,
  JwtAuthUserGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import type { User } from '@island.is/judicial-system/types'

import { adminRule, localAdminRule } from '../../guards'
import { CaseStatistics } from './models/caseStatistics.response'
import { CaseDataExportDto } from './statistics/caseDataExport.dto'
import { ExportDataResponse } from './statistics/exportData.response'
import { StatisticsService } from './statistics.service'

@Controller('api')
@ApiTags('statistics')
@UseGuards(JwtAuthUserGuard, RolesGuard)
export class StatisticsController {
  constructor(
    private readonly statisticService: StatisticsService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @RolesRules(adminRule, localAdminRule)
  @Get('cases/statistics')
  @ApiOkResponse({
    type: CaseStatistics,
    description: 'Gets court centered statistics for cases',
  })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  @ApiQuery({ name: 'institutionId', required: false, type: String })
  getStatistics(
    @Query('fromDate') fromDate?: Date,
    @Query('toDate') toDate?: Date,
    @Query('institutionId') institutionId?: string,
  ): Promise<CaseStatistics> {
    this.logger.debug('Getting statistics for all cases')

    return this.statisticService.getCaseStatistics(
      fromDate,
      toDate,
      institutionId,
    )
  }

  @RolesRules(adminRule, localAdminRule)
  @Get('cases/statistics/export-csv')
  @ApiOkResponse({
    description: 'Export transformed request case data',
    type: ExportDataResponse,
  })
  exportCaseEventData(
    @CurrentHttpUser() user: User,
    @Query('query') query: CaseDataExportDto,
  ): Promise<{ url: string }> {
    this.logger.debug('Create and export csv file for data analytics', query)

    return this.statisticService.extractTransformLoadEventDataToS3({
      type: query.type,
      period: query.period,
      user,
    })
  }
}
