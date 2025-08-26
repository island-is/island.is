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
import { SubpoenaQueryInput } from './dto/subpoena.input'
import { Subpoena } from './models/subpoena.model'

@UseGuards(JwtGraphQlAuthUserGuard)
@Resolver()
export class SubpoenaResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Query(() => Subpoena, { nullable: true })
  subpoena(
    @Args('input', { type: () => SubpoenaQueryInput })
    input: SubpoenaQueryInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<Subpoena> {
    this.logger.debug(
      `Getting subpoena ${input.subpoenaId} for defendant ${input.defendantId} of case ${input.caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_SUBPOENA,
      backendService.getSubpoena(
        input.caseId,
        input.defendantId,
        input.subpoenaId,
      ),
      input.caseId,
    )
  }
}
