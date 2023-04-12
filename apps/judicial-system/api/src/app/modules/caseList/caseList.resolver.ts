import { Query, Resolver, Context } from '@nestjs/graphql'
import { Inject, UseGuards, UseInterceptors } from '@nestjs/common'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'
import type { User } from '@island.is/judicial-system/types'
import {
  CurrentGraphQlUser,
  JwtGraphQlAuthGuard,
} from '@island.is/judicial-system/auth'

import { BackendApi } from '../../data-sources'
import { CaseListEntry } from './models/caseList.model'
import { CaseListInterceptor } from './interceptors/caseList.interceptor'

@UseGuards(JwtGraphQlAuthGuard)
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
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendApi },
  ): Promise<CaseListEntry[]> {
    this.logger.debug('Getting all cases')

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_CASES,
      backendApi.getCases(),
      (cases: CaseListEntry[]) => cases.map((aCase) => aCase.id),
    )
  }
}
