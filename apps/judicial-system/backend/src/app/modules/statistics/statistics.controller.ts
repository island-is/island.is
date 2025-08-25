import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  JwtAuthUserGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'

import { adminRule, localAdminRule } from '../../guards'
import {
  CaseStatistics,
  IndictmentCaseStatistics,
  RequestCaseStatistics,
} from './models/caseStatistics.response'
import { SubpoenaStatistics } from './models/subpoenaStatistics.response'
import { CaseDataExportDto } from './statistics/caseDataExport.dto'
import { ExportDataResponse } from './statistics/exportData.response'
import { IndictmentStatisticsDto } from './statistics/indictmentStatistics.dto'
import { RequestStatisticsDto } from './statistics/requestStatistics.dto'
import { SubpoenaStatisticsDto } from './statistics/subpoenaStatistics.dto'
import { StatisticsService } from './statistics.service'

@Controller('api')
@ApiTags('statistics')
export class StatisticsController {
  constructor(
    private readonly statisticService: StatisticsService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(JwtAuthUserGuard, RolesGuard)
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

  @UseGuards(JwtAuthUserGuard, RolesGuard)
  @RolesRules(adminRule, localAdminRule)
  @Get('cases/indictments/statistics')
  @ApiOkResponse({
    type: IndictmentCaseStatistics,
    description: 'Gets court centered statistics for cases',
  })
  getIndictmentCaseStatistics(
    @Query('query') query?: IndictmentStatisticsDto,
  ): Promise<IndictmentCaseStatistics> {
    this.logger.debug('Getting statistics for indictment cases')

    return this.statisticService.getIndictmentCaseStatistics(
      query?.sentToCourt,
      query?.institutionId,
    )
  }

  @UseGuards(JwtAuthUserGuard, RolesGuard)
  @RolesRules(adminRule, localAdminRule)
  @Get('cases/subpoenas/statistics')
  @ApiOkResponse({
    type: SubpoenaStatistics,
    description: 'Gets court centered statistics for subpoenas',
  })
  getSubpoenaStatistics(
    @Query('query') query?: SubpoenaStatisticsDto,
  ): Promise<SubpoenaStatistics> {
    this.logger.debug('Getting statistics for subpoenas')

    return this.statisticService.getSubpoenaStatistics(
      query?.created?.fromDate,
      query?.created?.toDate,
      query?.institutionId,
    )
  }

  @UseGuards(JwtAuthUserGuard, RolesGuard)
  @RolesRules(adminRule, localAdminRule)
  @Get('cases/requests/statistics')
  @ApiOkResponse({
    type: RequestCaseStatistics,
    description: 'Gets court centered statistics for requests cases',
  })
  getRequestCaseStatistics(
    @Query('query') query?: RequestStatisticsDto,
  ): Promise<RequestCaseStatistics> {
    this.logger.debug('Getting statistics for request cases')

    return this.statisticService.getRequestCasesStatistics(
      query?.created,
      query?.sentToCourt,
      query?.institutionId,
    )
  }

  @UseGuards(JwtAuthUserGuard, RolesGuard)
  @RolesRules(adminRule, localAdminRule)
  @Get('cases/statistics/export-csv')
  @ApiOkResponse({
    description: 'Export transformed request case data',
    type: ExportDataResponse,
  })
  exportCaseEventData(
    @Query('query') query: CaseDataExportDto,
  ): Promise<{ url: string }> {
    this.logger.debug('Create and export csv file for data analytics', query)

    return this.statisticService.extractTransformLoadRvgDataToS3({
      type: query.type,
      period: query.period,
    })
  }
}
