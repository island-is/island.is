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
import {
  CaseStatisticsInput,
  IndictmentStatisticsInput,
  RequestStatisticsInput,
  SubpoenaStatisticsInput,
} from './dto/caseStatistics.input'
import {
  CaseStatistics,
  IndictmentCaseStatistics,
  RequestCaseStatistics,
  SubpoenaStatistics,
} from './models/caseStatistics.model'

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

  @Query(() => IndictmentCaseStatistics, { nullable: true })
  indictmentCaseStatistics(
    @Args('input', { type: () => IndictmentStatisticsInput, nullable: true })
    input: IndictmentStatisticsInput,
    @CurrentGraphQlUser()
    user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<IndictmentCaseStatistics> {
    this.logger.debug('Getting indictment case statistics')

    const result = this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_CASES_STATISTICS,
      backendService.getIndictmentCaseStatistics(input),
      (caseStatistics: IndictmentCaseStatistics) =>
        caseStatistics.count.toString(),
    )

    return result
  }

  @Query(() => SubpoenaStatistics, { nullable: true })
  subpoenaStatistics(
    @Args('input', { type: () => SubpoenaStatisticsInput, nullable: true })
    input: SubpoenaStatisticsInput,
    @CurrentGraphQlUser()
    user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<SubpoenaStatistics> {
    this.logger.debug('Getting subpoena statistics')

    const result = this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_CASES_STATISTICS,
      backendService.getSubpoenaStatistics(input),
      (caseStatistics: SubpoenaStatistics) => caseStatistics.count.toString(),
    )

    return result
  }

  @Query(() => RequestCaseStatistics, { nullable: true })
  requestCaseStatistics(
    @Args('input', { type: () => RequestStatisticsInput, nullable: true })
    input: RequestStatisticsInput,
    @CurrentGraphQlUser()
    user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<RequestCaseStatistics> {
    this.logger.debug('Getting request case statistics')

    const result = this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_CASES_STATISTICS,
      backendService.getRequestCaseStatistics(input),
      (caseStatistics: RequestCaseStatistics) =>
        caseStatistics.count.toString(),
    )

    return result
  }

  @Query(() => SignedUrl, { nullable: true })
  getPreprocessedDataCsvSignedUrl(
    @Args('input', { type: () => RequestStatisticsInput, nullable: true })
    input: RequestStatisticsInput,
    @CurrentGraphQlUser()
    user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<SignedUrl> {
    this.logger.debug(
      'Getting preprocessed data as csv for request case statistics',
    )

    const result = this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_CASES_STATISTICS,
      backendService.getPreprocessedDataCsvSignedUrl(input),
      'stats', // TODO
    )

    return result
  }
}
