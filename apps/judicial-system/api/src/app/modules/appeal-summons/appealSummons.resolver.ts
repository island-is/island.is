import {
  ForbiddenException,
  Inject,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common'
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
  isCourtOfAppealsUser,
  isPublicProsecutionOfficeUser,
  isPublicProsecutionUser,
  type User,
} from '@island.is/judicial-system/types'

import { AppealCase } from '../appeal-case'
import { BackendService } from '../backend'
import { FeatureService } from '../feature/feature.service'
import {
  ConfirmAppealSummonsInput,
  CreateAppealSummonsInput,
  DeleteAppealSummonsInput,
  SendAppealSummonsToCourtOfAppealsInput,
  UpdateAppealSummonsInput,
} from './dto/appealSummons.input'
import { AppealSummons } from './models/appealSummons.model'
import { DeleteAppealSummonsResponse } from './models/deleteAppealSummons.response'

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
    @Args('caseId', new ParseUUIDPipe()) caseId: string,
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
    @Args('caseId', new ParseUUIDPipe()) caseId: string,
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

  @Mutation(() => DeleteAppealSummonsResponse)
  deleteAppealSummons(
    @Args('input', { type: () => DeleteAppealSummonsInput })
    input: DeleteAppealSummonsInput,
    @CurrentGraphQlUser() user: User,
  ): Promise<DeleteAppealSummonsResponse> {
    this.assertVerdictAppealsAvailable()

    this.logger.debug(
      `Deleting appeal summons ${input.appealSummonsId} of case ${input.caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.DELETE_APPEAL_SUMMONS,
      this.backendService.deleteAppealSummons(
        input.caseId,
        input.appealSummonsId,
      ),
      input.appealSummonsId,
    )
  }

  @Mutation(() => AppealSummons)
  confirmAppealSummons(
    @Args('caseId', { type: () => String }) caseId: string,
    @Args('input', { type: () => ConfirmAppealSummonsInput })
    input: ConfirmAppealSummonsInput,
    @CurrentGraphQlUser() user: User,
  ): Promise<AppealSummons> {
    this.assertVerdictAppealsAvailable()

    this.logger.debug(
      `Confirming appeal summons ${input.appealSummonsId} of case ${caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CONFIRM_APPEAL_SUMMONS,
      this.backendService.confirmAppealSummons(caseId, input.appealSummonsId),
      caseId,
    )
  }

  @Mutation(() => AppealSummons)
  sendAppealSummonsToCourtOfAppeals(
    @Args('caseId', { type: () => String }) caseId: string,
    @Args('input', { type: () => SendAppealSummonsToCourtOfAppealsInput })
    input: SendAppealSummonsToCourtOfAppealsInput,
    @CurrentGraphQlUser() user: User,
  ): Promise<AppealSummons> {
    this.assertVerdictAppealsAvailable()

    this.logger.debug(
      `Sending appeal summons ${input.appealSummonsId} of case ${caseId} to the court of appeals`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.SEND_APPEAL_SUMMONS_TO_COURT_OF_APPEALS,
      this.backendService.sendAppealSummonsToCourtOfAppeals(
        caseId,
        input.appealSummonsId,
      ),
      caseId,
    )
  }
}

@UseGuards(JwtGraphQlAuthUserGuard)
@Resolver(() => AppealCase)
export class AppealCaseAppealSummonsResolver {
  constructor(private readonly featureService: FeatureService) {}

  @ResolveField('appealSummonses', () => [AppealSummons], { nullable: true })
  appealSummonses(
    @Parent() appealCase: AppealCase,
    @CurrentGraphQlUser() user: User,
  ): AppealSummons[] {
    if (
      this.featureService.isHidden(Feature.INDICTMENT_APPEAL) ||
      !(isPublicProsecutionOfficeUser(user) || isPublicProsecutionUser(user))
    ) {
      return []
    }

    return appealCase.appealSummonses ?? []
  }

  @ResolveField('sentAppealSummonses', () => [AppealSummons], {
    nullable: true,
  })
  sentAppealSummonses(
    @Parent() appealCase: AppealCase,
    @CurrentGraphQlUser() user: User,
  ): AppealSummons[] {
    if (
      this.featureService.isHidden(Feature.INDICTMENT_APPEAL) ||
      !isCourtOfAppealsUser(user)
    ) {
      return []
    }

    return appealCase.sentAppealSummonses ?? []
  }
}
