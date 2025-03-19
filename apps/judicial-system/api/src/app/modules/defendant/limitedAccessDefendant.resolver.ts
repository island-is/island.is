import { Inject, UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

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
import { UpdateDefendantInput } from './dto/updateDefendant.input'
import { Defendant } from './models/defendant.model'

@UseGuards(JwtGraphQlAuthUserGuard)
@Resolver()
export class LimitedAccessDefendantResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Mutation(() => Defendant, { nullable: true })
  limitedAccessUpdateDefendant(
    @Args('input', { type: () => UpdateDefendantInput })
    input: UpdateDefendantInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<Defendant> {
    const { caseId, defendantId, ...updateDefendant } = input
    this.logger.debug(
      `Updating limitedAccess defendant ${defendantId} for case ${caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPDATE_DEFENDANT,
      backendService.limitedAccessUpdateDefendant(
        caseId,
        defendantId,
        updateDefendant,
      ),
      defendantId,
    )
  }
}
