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
  AppealCaseType,
  Feature,
  type User,
} from '@island.is/judicial-system/types'

import { BackendService } from '../backend'
import { FeatureService } from '../feature/feature.service'
import { AppealCase } from './dto/appealCase.response'
import { CreateAppealCaseInput } from './dto/createAppealCase.input'
import { CreateAppealEventLogInput } from './dto/createAppealEventLog.input'
import { TransitionAppealCaseInput } from './dto/transitionAppealCase.input'
import { UpdateAppealCaseInput } from './dto/updateAppealCase.input'

@UseGuards(JwtGraphQlAuthUserGuard)
@Resolver(() => AppealCase)
export class AppealCaseResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly backendService: BackendService,
    private readonly featureService: FeatureService,
  ) {}

  // The flag hides the verdict appeal actions in the web; closing the write
  // paths here too means a hidden feature cannot be reached by calling the API
  // directly. Mirrors the limited-access resolver.
  private assertVerdictAppealsAvailable() {
    if (this.featureService.isHidden(Feature.INDICTMENT_APPEAL)) {
      throw new ForbiddenException('Indictment appeals are not available')
    }
  }

  @Mutation(() => AppealCase, { nullable: true })
  createAppealCase(
    @Args('input', { type: () => CreateAppealCaseInput })
    input: CreateAppealCaseInput,
    @CurrentGraphQlUser() user: User,
  ): Promise<AppealCase> {
    const { caseId, ...body } = input

    if (body.appealType === AppealCaseType.VERDICT) {
      this.assertVerdictAppealsAvailable()
    }

    this.logger.debug(`Creating appeal case for case ${caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_APPEAL_CASE,
      this.backendService.createAppealCase(caseId, body),
      caseId,
    )
  }

  @Mutation(() => AppealCase, { nullable: true })
  updateAppealCase(
    @Args('input', { type: () => UpdateAppealCaseInput })
    input: UpdateAppealCaseInput,
    @CurrentGraphQlUser() user: User,
  ): Promise<AppealCase> {
    const { caseId, appealCaseId, ...updateAppealCase } = input

    this.logger.debug(`Updating appeal case ${appealCaseId} of case ${caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPDATE_APPEAL_CASE,
      this.backendService.updateAppealCase(
        caseId,
        appealCaseId,
        updateAppealCase,
      ),
      caseId,
    )
  }

  @Mutation(() => AppealCase, { nullable: true })
  createAppealEventLog(
    @Args('input', { type: () => CreateAppealEventLogInput })
    input: CreateAppealEventLogInput,
  ): Promise<AppealCase> {
    const { caseId, appealCaseId, eventType } = input

    this.logger.debug(
      `Creating appeal event log ${eventType} on appeal case ${appealCaseId} of case ${caseId}`,
    )

    return this.backendService.createAppealEventLog(
      caseId,
      appealCaseId,
      eventType,
    )
  }

  @Mutation(() => AppealCase, { nullable: true })
  transitionAppealCase(
    @Args('input', { type: () => TransitionAppealCaseInput })
    input: TransitionAppealCaseInput,
    @CurrentGraphQlUser() user: User,
  ): Promise<AppealCase> {
    const { caseId, appealCaseId, ...transitionAppealCase } = input

    // Only a verdict appeal is transitioned for one defendant.
    if (transitionAppealCase.defendantId) {
      this.assertVerdictAppealsAvailable()
    }

    this.logger.debug(
      `Transitioning appeal case ${appealCaseId} of case ${caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.TRANSITION_APPEAL_CASE,
      this.backendService.transitionAppealCase(
        caseId,
        appealCaseId,
        transitionAppealCase,
      ),
      caseId,
    )
  }
}
