import { Inject, Logger, UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

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
import { UpdateVerdictInput } from './dto/updateVerdict.input'
import { Verdict } from './models/verdict.model'

@UseGuards(JwtGraphQlAuthUserGuard)
@Resolver(() => Verdict)
export class VerdictResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Mutation(() => Verdict, { nullable: true })
  updateVerdict(
    @Args('input', { type: () => UpdateVerdictInput })
    input: UpdateVerdictInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<Verdict> {
    this.logger.debug(
      `Updating verdict for defendant ${input.defendantId} of case ${input.caseId}`,
    )
    const { caseId, defendantId, ...updateVerdict } = input

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPDATE_VERDICT,
      backendService.updateVerdict(caseId, defendantId, updateVerdict),
      defendantId,
    )
  }
}
