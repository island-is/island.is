import { ForbiddenException, Inject, UseGuards } from '@nestjs/common'
import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql'

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
  isPublicProsecutionOfficeUser,
  type User,
} from '@island.is/judicial-system/types'

import { BackendService } from '../backend'
import { Case } from '../case'
import { FeatureService } from '../feature/feature.service'
import {
  CreateAppealSummonsInput,
  UpdateAppealSummonsInput,
} from './dto/appealSummons.input'
import { AppealSummons } from './models/appealSummons.model'

@UseGuards(JwtGraphQlAuthUserGuard)
@Resolver(() => AppealSummons)
export class AppealSummonsResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly backendService: BackendService,
    private readonly featureService: FeatureService,
  ) {}

  private assertVerdictAppealsAvailable() {
    if (this.featureService.isHidden(Feature.INDICTMENT_APPEAL)) {
      throw new ForbiddenException('Indictment appeals are not available')
    }
  }

  @Mutation(() => AppealSummons)
  createAppealSummons(
    @Args('caseId', { type: () => String }) caseId: string,
    @Args('input', { type: () => CreateAppealSummonsInput })
    input: CreateAppealSummonsInput,
    @CurrentGraphQlUser() user: User,
  ): Promise<AppealSummons> {
    this.assertVerdictAppealsAvailable()

    this.logger.debug(`Creating an appeal summons for case ${caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_APPEAL_SUMMONS,
      this.backendService.createAppealSummons(caseId, {
        defendants: input.defendants,
      }),
      caseId,
    )
  }

  @Mutation(() => AppealSummons)
  updateAppealSummons(
    @Args('caseId', { type: () => String }) caseId: string,
    @Args('input', { type: () => UpdateAppealSummonsInput })
    input: UpdateAppealSummonsInput,
    @CurrentGraphQlUser() user: User,
  ): Promise<AppealSummons> {
    this.assertVerdictAppealsAvailable()

    this.logger.debug(
      `Updating appeal summons ${input.appealSummonsId} of case ${caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPDATE_APPEAL_SUMMONS,
      this.backendService.updateAppealSummons(caseId, input.appealSummonsId, {
        defendants: input.defendants,
      }),
      caseId,
    )
  }
}

@UseGuards(JwtGraphQlAuthUserGuard)
@Resolver(() => Case)
export class CaseAppealSummonsResolver {
  constructor(private readonly featureService: FeatureService) {}

  @ResolveField('appealSummonses', () => [AppealSummons], { nullable: true })
  appealSummonses(
    @Parent() theCase: Case,
    @CurrentGraphQlUser() user: User,
  ): AppealSummons[] {
    if (
      this.featureService.isHidden(Feature.INDICTMENT_APPEAL) ||
      !isPublicProsecutionOfficeUser(user)
    ) {
      return []
    }

    return theCase.appealSummonses ?? []
  }
}
