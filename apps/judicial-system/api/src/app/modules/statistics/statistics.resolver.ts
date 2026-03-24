import { Inject, UseGuards } from '@nestjs/common'
import { Args, Context, Query, Resolver } from '@nestjs/graphql'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'
import {
  CurrentGraphQlUser,
  JwtGraphQlAuthUserGuard,
} from '@island.is/judicial-system/auth'
import type { User } from '@island.is/judicial-system/types'

import { BackendService } from '../backend'
import { SignedUrl } from '../file'
import { CaseDataExportInput } from './dto/caseDataExport.input'
import { CaseStatisticsInput } from './dto/caseStatistics.input'
import { CaseStatistics } from './models/caseStatistics.model'

@UseGuards(JwtGraphQlAuthUserGuard)
@Resolver()
export class StatisticsResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Query(() => CaseStatistics, { nullable: true })
  caseStatistics(
    @Args('input', { type: () => CaseStatisticsInput, nullable: true })
    input: CaseStatisticsInput,
    @CurrentGraphQlUser()
    user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<CaseStatistics> {
    this.logger.debug('Getting case statistics')

    const result = this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_CASES_STATISTICS,
      backendService.getCaseStatistics(
        input.fromDate,
        input.toDate,
        input.institutionId,
      ),
      (caseStatistics: CaseStatistics) => caseStatistics.count.toString(),
    )

    return result
  }

  @Query(() => SignedUrl, { nullable: true })
  getPreprocessedDataCsvSignedUrl(
    @Args('input', { type: () => CaseDataExportInput })
    input: CaseDataExportInput,
    @CurrentGraphQlUser()
    user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<SignedUrl> {
    this.logger.debug('Getting preprocessed data as csv for case statistics')

    const result = this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_CASES_STATISTICS,
      backendService.getPreprocessedDataCsvSignedUrl(input),
      'export',
    )

    return result
  }
}
