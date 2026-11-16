import { ForbiddenException, Inject, UseGuards } from '@nestjs/common'
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
import {
  Feature,
  type User,
  VerdictAppealDecision,
} from '@island.is/judicial-system/types'

import { BackendService } from '../backend'
import { FeatureService } from '../feature/feature.service'
import { AcceptVerdictInput } from './dto/acceptVerdict.input'
import { Verdict } from './models/verdict.model'

@UseGuards(new JwtGraphQlAuthUserGuard(true))
@Resolver(() => Verdict)
export class LimitedAccessVerdictResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly backendService: BackendService,
    private readonly featureService: FeatureService,
  ) {}

  @Mutation(() => Verdict, { nullable: true })
  limitedAccessAcceptVerdict(
    @Args('input', { type: () => AcceptVerdictInput })
    input: AcceptVerdictInput,
    @CurrentGraphQlUser() user: User,
  ): Promise<Verdict> {
    const { caseId, defendantId } = input

    // The flag hides the action in the web; closing the write path here too
    // means a hidden feature cannot be reached by calling the API directly.
    if (this.featureService.isHidden(Feature.INDICTMENT_APPEAL)) {
      throw new ForbiddenException('Indictment appeals are not available')
    }

    this.logger.debug(
      `Accepting verdict for defendant ${defendantId} of case ${caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPDATE_VERDICT,
      this.backendService.limitedAccessAcceptVerdict(caseId, defendantId, {
        appealDecision: VerdictAppealDecision.ACCEPT,
      }),
      defendantId,
    )
  }
}
