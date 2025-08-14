import { Inject, UseGuards, UseInterceptors } from '@nestjs/common'
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
import { CaseListQueryInput } from './dto/caseList.input'
import {
  CaseStatisticsInput,
  IndictmentStatisticsInput,
  RequestStatisticsInput,
  SubpoenaStatisticsInput,
} from './dto/caseStatistics.input'
import { CaseListInterceptor } from './interceptors/caseList.interceptor'
import { CaseListEntry } from './models/caseList.model'
import {
  CaseStatistics,
  IndictmentCaseStatistics,
  RequestCaseStatistics,
  SubpoenaStatistics,
} from './models/caseStatistics.model'

@UseGuards(JwtGraphQlAuthUserGuard)
@Resolver(() => [CaseListEntry])
export class CaseListResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Query(() => [CaseListEntry], { nullable: true })
  @UseInterceptors(CaseListInterceptor)
  cases(
    @Args('input', { type: () => CaseListQueryInput, nullable: true })
    input: CaseListQueryInput,
    @CurrentGraphQlUser()
    user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<CaseListEntry[]> {
    this.logger.debug('Getting all cases')

    let result = this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_CASES,
      backendService.getCases(),
      (cases: CaseListEntry[]) => cases.map((aCase) => aCase.id),
    )

    if (input?.appealState) {
      result = result.then((cases) =>
        cases.filter(
          (aCase) =>
            aCase.appealState && input.appealState?.includes(aCase.appealState),
        ),
      )
    }

    return result
  }

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
}
