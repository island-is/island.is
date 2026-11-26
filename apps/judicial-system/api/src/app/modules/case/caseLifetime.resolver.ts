import { Inject, UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'

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
import type { User as TUser } from '@island.is/judicial-system/types'

import { BackendService } from '../backend'
import { ExtendCaseLifetimeInput } from './dto/extendCaseLifetime.input'
import { CaseLifetimeResponse } from './models/caseLifetime.response'

@Resolver(() => CaseLifetimeResponse)
export class CaseLifetimeResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly backendService: BackendService,
  ) {}

  @UseGuards(JwtGraphQlAuthUserGuard)
  @Mutation(() => CaseLifetimeResponse, { nullable: true })
  extendCaseLifetime(
    @Args('input', { type: () => ExtendCaseLifetimeInput })
    input: ExtendCaseLifetimeInput,
    @CurrentGraphQlUser() user: TUser,
  ): Promise<CaseLifetimeResponse> {
    const { caseId, days } = input

    this.logger.debug(`Extending the lifetime of case ${caseId}`)

    // The trail records who extended which case, and whether that brought the
    // case back from its archive
    return this.auditTrailService.audit(
      user.id,
      AuditedAction.EXTEND_CASE_LIFETIME,
      this.backendService.extendCaseLifetime(caseId, days),
      caseId,
      async (response) => ({
        caseRestored: response.caseRestored,
        archiveNotBefore: response.archiveNotBefore,
      }),
    )
  }
}
