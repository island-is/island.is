import { Inject, UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'
import {
  CurrentGraphQlUser,
  JwtGraphQlAuthUserGuard,
} from '@island.is/judicial-system/auth'
import { type User } from '@island.is/judicial-system/types'

import { BackendService } from '../backend'
import { CaseTableQueryInput } from './dto/caseTable.input'
import { CaseTableResponse } from './dto/caseTable.response'
import { CaseTableMembershipResponse } from './dto/caseTableMembership.response'
import { SearchCasesQueryInput } from './dto/searchCases.input'
import { SearchCasesResponse } from './dto/searchCases.response'

@UseGuards(JwtGraphQlAuthUserGuard)
@Resolver(() => CaseTableResponse)
export class CaseTableResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly backendService: BackendService,
  ) {}

  @Query(() => CaseTableResponse)
  caseTable(
    @Args('input', { type: () => CaseTableQueryInput })
    input: CaseTableQueryInput,
    @CurrentGraphQlUser() user: User,
  ): Promise<CaseTableResponse> {
    this.logger.debug(`Getting a case table of type ${input.type}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_CASE_TABLE,
      this.backendService.getCaseTable(input.type),
      (response) => response.rows.map((row) => row.caseId),
    )
  }

  @Query(() => SearchCasesResponse)
  searchCases(
    @Args('input', { type: () => SearchCasesQueryInput })
    input: SearchCasesQueryInput,
    @CurrentGraphQlUser() user: User,
  ): Promise<SearchCasesResponse> {
    this.logger.debug(`Searching for cases`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.SEARCH_CASES,
      this.backendService.searchCases(input.query),
      (response) => response.rows.map((row) => row.caseId),
    )
  }

  @Query(() => CaseTableMembershipResponse, {
    nullable: true,
    description:
      'Returns which case tables (for the current user role) the case belongs to. Use for breadcrumbs on the case page.',
  })
  caseTableMembership(
    @Args('caseId', { type: () => String }) caseId: string,
  ): Promise<CaseTableMembershipResponse | null> {
    this.logger.debug(`Getting case table membership for case ${caseId}`)

    return this.backendService
      .getCaseTableMembership(caseId)
      .catch((error: unknown) => {
        const status =
          (error as { status?: number })?.status ??
          (error as { statusCode?: number })?.statusCode
        return status === 404 ? null : Promise.reject(error)
      })
  }
}
