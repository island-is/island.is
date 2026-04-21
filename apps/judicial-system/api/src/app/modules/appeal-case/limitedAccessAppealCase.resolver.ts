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
import { type User } from '@island.is/judicial-system/types'

import { BackendService } from '../backend'
import { AppealCase } from './dto/appealCase.response'
import { CreateAppealCaseInput } from './dto/createAppealCase.input'
import { TransitionAppealCaseInput } from './dto/transitionAppealCase.input'
import { UpdateAppealCaseInput } from './dto/updateAppealCase.input'

@UseGuards(new JwtGraphQlAuthUserGuard(true))
@Resolver(() => AppealCase)
export class LimitedAccessAppealCaseResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Mutation(() => AppealCase, { nullable: true })
  limitedAccessCreateAppealCase(
    @Args('input', { type: () => CreateAppealCaseInput })
    input: CreateAppealCaseInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<AppealCase> {
    this.logger.debug(
      `Creating limited access appeal case for case ${input.caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_APPEAL_CASE,
      backendService.limitedAccessCreateAppealCase(input.caseId),
      input.caseId,
    )
  }

  @Mutation(() => AppealCase, { nullable: true })
  limitedAccessUpdateAppealCase(
    @Args('input', { type: () => UpdateAppealCaseInput })
    input: UpdateAppealCaseInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<AppealCase> {
    const { caseId, appealCaseId, ...updateAppealCase } = input

    this.logger.debug(
      `Updating limited access appeal case ${appealCaseId} of case ${caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPDATE_APPEAL_CASE,
      backendService.limitedAccessUpdateAppealCase(
        caseId,
        appealCaseId,
        updateAppealCase,
      ),
      caseId,
    )
  }

  @Mutation(() => AppealCase, { nullable: true })
  limitedAccessTransitionAppealCase(
    @Args('input', { type: () => TransitionAppealCaseInput })
    input: TransitionAppealCaseInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<AppealCase> {
    const { caseId, appealCaseId, ...transitionAppealCase } = input

    this.logger.debug(
      `Transitioning limited access appeal case ${appealCaseId} of case ${caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.TRANSITION_APPEAL_CASE,
      backendService.limitedAccessTransitionAppealCase(
        caseId,
        appealCaseId,
        transitionAppealCase,
      ),
      caseId,
    )
  }
}
