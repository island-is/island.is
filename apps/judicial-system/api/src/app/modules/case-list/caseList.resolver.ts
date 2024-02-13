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
  JwtGraphQlAuthGuard,
} from '@island.is/judicial-system/auth'
import type { User } from '@island.is/judicial-system/types'

import { BackendApi } from '../../data-sources'
import { CaseListQueryInput } from './dto/caseList.input'
import { CaseListInterceptor } from './interceptors/caseList.interceptor'
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
  @UseInterceptors(CaseListInterceptor)
  cases(
    @Args('input', { type: () => CaseListQueryInput, nullable: true })
    input: CaseListQueryInput,
    @CurrentGraphQlUser()
    user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendApi },
  ): Promise<CaseListEntry[]> {
    this.logger.debug('Getting all cases')

    let result = this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_CASES,
      backendApi.getCases(),
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
}
