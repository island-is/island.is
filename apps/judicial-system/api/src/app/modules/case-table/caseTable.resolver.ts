import { Inject, UseGuards } from '@nestjs/common'
import { Args, Context, Query, Resolver } from '@nestjs/graphql'

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

@UseGuards(JwtGraphQlAuthUserGuard)
@Resolver(() => CaseTableResponse)
export class CaseTableResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Query(() => CaseTableResponse)
  async caseTable(
    @Args('input', { type: () => CaseTableQueryInput })
    input: CaseTableQueryInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<CaseTableResponse> {
    this.logger.debug(`Getting a case table of type ${input.type}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_CASE_TABLE,
      backendService.getCaseTable(input.type),
      input.type,
    )
  }
}
