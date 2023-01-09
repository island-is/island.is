import { Query, Resolver, Context } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'

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
// import { CasesInterceptor } from './interceptors/cases.interceptor'
import { CaseListEntry } from './models/caseList.model'

@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => [CaseListEntry])
export class CaseListResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Query(() => [CaseListEntry], { nullable: true })
  // @UseInterceptors(CasesInterceptor)
  cases(
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendApi },
  ): Promise<CaseListEntry[]> {
    this.logger.debug('Getting all cases')

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_CASES,
      backendApi.getCasesV2(),
      (cases: CaseListEntry[]) => cases.map((aCase) => aCase.id),
    )
  }
}
