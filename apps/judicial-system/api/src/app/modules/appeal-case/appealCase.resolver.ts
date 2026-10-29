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
  AppealCaseType,
  Feature,
  getAppealJudges,
  type User,
} from '@island.is/judicial-system/types'

import { BackendService } from '../backend'
import { FeatureService } from '../feature/feature.service'
import { User as UserResponse } from '../user'
import { AppealCase } from './dto/appealCase.response'
import { AppealCourtSession } from './dto/appealCourtSession.response'
import { AppealEventLog } from './dto/appealEventLog.response'
import { AppealStatementDeadline } from './dto/appealStatementDeadline.response'
import { CreateAppealCaseInput } from './dto/createAppealCase.input'
import { CreateAppealCourtSessionInput } from './dto/createAppealCourtSession.input'
import { CreateAppealEventLogInput } from './dto/createAppealEventLog.input'
import { DeleteAppealCourtSessionInput } from './dto/deleteAppealCourtSession.input'
import { DeleteAppealCourtSessionResponse } from './dto/deleteAppealCourtSession.response'
import { FileAppealStatementInput } from './dto/fileAppealStatement.input'
import { SetAppealStatementDeadlineInput } from './dto/setAppealStatementDeadline.input'
import { TransitionAppealCaseInput } from './dto/transitionAppealCase.input'
import { UpdateAppealCaseInput } from './dto/updateAppealCase.input'
import { UpdateAppealCourtSessionInput } from './dto/updateAppealCourtSession.input'

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

  @ResolveField('appealJudge1', () => UserResponse, { nullable: true })
  appealJudge1(@Parent() appealCase: AppealCase): UserResponse | undefined {
    return getAppealJudges(appealCase)[0]
  }

  @ResolveField('appealJudge2', () => UserResponse, { nullable: true })
  appealJudge2(@Parent() appealCase: AppealCase): UserResponse | undefined {
    return getAppealJudges(appealCase)[1]
  }

  @ResolveField('appealJudge3', () => UserResponse, { nullable: true })
  appealJudge3(@Parent() appealCase: AppealCase): UserResponse | undefined {
    return getAppealJudges(appealCase)[2]
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

  @Mutation(() => AppealCourtSession, { nullable: true })
  createAppealCourtSession(
    @Args('input', { type: () => CreateAppealCourtSessionInput })
    input: CreateAppealCourtSessionInput,
    @CurrentGraphQlUser() user: User,
  ): Promise<AppealCourtSession> {
    const { caseId, appealCaseId, ...body } = input

    this.assertVerdictAppealsAvailable()

    this.logger.debug(
      `Creating a court session in appeal case ${appealCaseId} of case ${caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_APPEAL_COURT_SESSION,
      this.backendService.createAppealCourtSession(caseId, appealCaseId, body),
      caseId,
    )
  }

  @Mutation(() => AppealCourtSession, { nullable: true })
  updateAppealCourtSession(
    @Args('input', { type: () => UpdateAppealCourtSessionInput })
    input: UpdateAppealCourtSessionInput,
    @CurrentGraphQlUser() user: User,
  ): Promise<AppealCourtSession> {
    const { caseId, appealCaseId, appealCourtSessionId, ...body } = input

    this.assertVerdictAppealsAvailable()

    this.logger.debug(
      `Updating court session ${appealCourtSessionId} in appeal case ${appealCaseId} of case ${caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPDATE_APPEAL_COURT_SESSION,
      this.backendService.updateAppealCourtSession(
        caseId,
        appealCaseId,
        appealCourtSessionId,
        body,
      ),
      caseId,
    )
  }

  @Mutation(() => DeleteAppealCourtSessionResponse, { nullable: true })
  deleteAppealCourtSession(
    @Args('input', { type: () => DeleteAppealCourtSessionInput })
    input: DeleteAppealCourtSessionInput,
    @CurrentGraphQlUser() user: User,
  ): Promise<DeleteAppealCourtSessionResponse> {
    const { caseId, appealCaseId, appealCourtSessionId } = input

    this.assertVerdictAppealsAvailable()

    this.logger.debug(
      `Deleting court session ${appealCourtSessionId} in appeal case ${appealCaseId} of case ${caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.DELETE_APPEAL_COURT_SESSION,
      this.backendService.deleteAppealCourtSession(
        caseId,
        appealCaseId,
        appealCourtSessionId,
      ),
      caseId,
    )
  }

  @Mutation(() => AppealStatementDeadline, { nullable: true })
  setAppealStatementDeadline(
    @Args('input', { type: () => SetAppealStatementDeadlineInput })
    input: SetAppealStatementDeadlineInput,
    @CurrentGraphQlUser() user: User,
  ): Promise<AppealStatementDeadline> {
    const { caseId, appealCaseId, ...body } = input

    this.assertVerdictAppealsAvailable()

    this.logger.debug(
      `Setting a statement deadline in appeal case ${appealCaseId} of case ${caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.SET_APPEAL_STATEMENT_DEADLINE,
      this.backendService.setAppealStatementDeadline(
        caseId,
        appealCaseId,
        body,
      ),
      caseId,
    )
  }

  // The court of appeals records a party's statement as filed, having
  // uploaded it on the party's behalf.
  @Mutation(() => AppealEventLog, { nullable: true })
  fileAppealStatement(
    @Args('input', { type: () => FileAppealStatementInput })
    input: FileAppealStatementInput,
    @CurrentGraphQlUser() user: User,
  ): Promise<AppealEventLog> {
    const { caseId, appealCaseId, ...body } = input

    this.assertVerdictAppealsAvailable()

    this.logger.debug(
      `Filing a statement on a party's behalf in appeal case ${appealCaseId} of case ${caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.FILE_APPEAL_STATEMENT,
      this.backendService.fileAppealStatement(caseId, appealCaseId, body),
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
