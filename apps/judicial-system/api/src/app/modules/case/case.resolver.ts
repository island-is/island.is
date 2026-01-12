import { Inject, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'

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
import { CaseQueryInput } from './dto/case.input'
import { CreateCaseInput } from './dto/createCase.input'
import { CreateCourtCaseInput } from './dto/createCourtCase.input'
import { ExtendCaseInput } from './dto/extendCase.input'
import { RequestSignatureInput } from './dto/requestSignature.input'
import { SendNotificationInput } from './dto/sendNotification.input'
import { SignatureConfirmationQueryInput } from './dto/signatureConfirmation.input'
import { SplitDefendantFromCaseInput } from './dto/splitDefendantFromCase.input'
import { TransitionCaseInput } from './dto/transitionCase.input'
import { UpdateCaseInput } from './dto/updateCase.input'
import { CaseInterceptor } from './interceptors/case.interceptor'
import { Case } from './models/case.model'
import { RequestSignatureResponse } from './models/requestSignature.response'
import { SendNotificationResponse } from './models/sendNotification.response'
import { SignatureConfirmationResponse } from './models/signatureConfirmation.response'

@UseGuards(JwtGraphQlAuthUserGuard)
@Resolver(() => Case)
export class CaseResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Query(() => Case, { nullable: true })
  @UseInterceptors(CaseInterceptor)
  async case(
    @Args('input', { type: () => CaseQueryInput })
    input: CaseQueryInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<Case> {
    this.logger.debug(`Getting case ${input.id}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_CASE,
      backendService.getCase(input.id),
      input.id,
    )
  }

  @Query(() => [Case], { nullable: true })
  async connectedCases(
    @Args('input', { type: () => CaseQueryInput })
    input: CaseQueryInput,
    @CurrentGraphQlUser()
    user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<Case[]> {
    this.logger.debug('Getting connected cases')

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_CONNECTED_CASES,
      backendService.getConnectedCases(input.id),
      input.id,
    )
  }

  @Mutation(() => Case, { nullable: true })
  @UseInterceptors(CaseInterceptor)
  createCase(
    @Args('input', { type: () => CreateCaseInput })
    input: CreateCaseInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<Case> {
    this.logger.debug('Creating a new case')

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_CASE,
      backendService.createCase(input),
      (theCase) => theCase.id,
    )
  }

  @Mutation(() => Case, { nullable: true })
  @UseInterceptors(CaseInterceptor)
  updateCase(
    @Args('input', { type: () => UpdateCaseInput })
    input: UpdateCaseInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<Case> {
    const { id, ...updateCase } = input

    this.logger.debug(`Updating case ${id}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPDATE_CASE,
      backendService.updateCase(id, updateCase),
      id,
    )
  }

  @Mutation(() => Case, { nullable: true })
  @UseInterceptors(CaseInterceptor)
  transitionCase(
    @Args('input', { type: () => TransitionCaseInput })
    input: TransitionCaseInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<Case> {
    const { id, ...transitionCase } = input

    this.logger.debug(`Transitioning case ${id}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.TRANSITION_CASE,
      backendService.transitionCase(id, transitionCase),
      id,
    )
  }

  @Mutation(() => RequestSignatureResponse, { nullable: true })
  requestCourtRecordSignature(
    @Args('input', { type: () => RequestSignatureInput })
    input: RequestSignatureInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<RequestSignatureResponse> {
    this.logger.debug(
      `Requesting signature of court record for case ${input.caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.REQUEST_COURT_RECORD_SIGNATURE,
      backendService.requestCourtRecordSignature(
        input.caseId,
        input.method ?? 'mobile',
      ),
      input.caseId,
    )
  }

  @Mutation(() => RequestSignatureResponse, { nullable: true })
  requestCourtRecordSignatureAudkenni(
    @Args('input', { type: () => RequestSignatureInput })
    input: RequestSignatureInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<RequestSignatureResponse> {
    this.logger.debug(
      `Requesting signature of court record via Audkenni for case ${input.caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.REQUEST_RULING_SIGNATURE,
      backendService.requestCourtRecordSignatureAudkenni(input.caseId),
      input.caseId,
    )
  }

  @Query(() => SignatureConfirmationResponse, { nullable: true })
  courtRecordSignatureConfirmation(
    @Args('input', { type: () => SignatureConfirmationQueryInput })
    input: SignatureConfirmationQueryInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<SignatureConfirmationResponse> {
    const { caseId, documentToken, method } = input

    this.logger.debug(`Confirming signature of court record for case ${caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CONFIRM_COURT_RECORD_SIGNATURE,
      backendService.getCourtRecordSignatureConfirmation(
        caseId,
        documentToken,
        method ?? 'mobile',
      ),
      caseId,
    )
  }

  @Query(() => SignatureConfirmationResponse, { nullable: true })
  courtRecordSignatureConfirmationAudkenni(
    @Args('input', { type: () => SignatureConfirmationQueryInput })
    input: SignatureConfirmationQueryInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<SignatureConfirmationResponse> {
    const { caseId, documentToken } = input

    this.logger.debug(
      `Confirming signature of court record via Audkenni for case ${caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CONFIRM_RULING_SIGNATURE,
      backendService.getCourtRecordSignatureConfirmationAudkenni(
        caseId,
        documentToken,
      ),
      caseId,
    )
  }

  @Mutation(() => RequestSignatureResponse, { nullable: true })
  requestRulingSignature(
    @Args('input', { type: () => RequestSignatureInput })
    input: RequestSignatureInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<RequestSignatureResponse> {
    this.logger.debug(`Requesting signature of ruling for case ${input.caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.REQUEST_RULING_SIGNATURE,
      backendService.requestRulingSignature(
        input.caseId,
        input.method ?? 'mobile',
      ),
      input.caseId,
    )
  }

  @Mutation(() => RequestSignatureResponse, { nullable: true })
  requestRulingSignatureAudkenni(
    @Args('input', { type: () => RequestSignatureInput })
    input: RequestSignatureInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<RequestSignatureResponse> {
    this.logger.debug(
      `Requesting signature of ruling via Audkenni for case ${input.caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.REQUEST_RULING_SIGNATURE,
      backendService.requestRulingSignatureAudkenni(input.caseId),
      input.caseId,
    )
  }

  @Query(() => SignatureConfirmationResponse, { nullable: true })
  rulingSignatureConfirmation(
    @Args('input', { type: () => SignatureConfirmationQueryInput })
    input: SignatureConfirmationQueryInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<SignatureConfirmationResponse> {
    const { caseId, documentToken, method } = input

    this.logger.debug(`Confirming signature of ruling for case ${caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CONFIRM_RULING_SIGNATURE,
      backendService.getRulingSignatureConfirmation(
        caseId,
        documentToken,
        method ?? 'mobile',
      ),
      caseId,
    )
  }

  @Query(() => SignatureConfirmationResponse, { nullable: true })
  rulingSignatureConfirmationAudkenni(
    @Args('input', { type: () => SignatureConfirmationQueryInput })
    input: SignatureConfirmationQueryInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<SignatureConfirmationResponse> {
    const { caseId, documentToken } = input

    this.logger.debug(
      `Confirming signature of ruling via Audkenni for case ${caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CONFIRM_RULING_SIGNATURE,
      backendService.getRulingSignatureConfirmationAudkenni(
        caseId,
        documentToken,
      ),
      caseId,
    )
  }

  @Mutation(() => SendNotificationResponse, { nullable: true })
  sendNotification(
    @Args('input', { type: () => SendNotificationInput })
    input: SendNotificationInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<SendNotificationResponse> {
    const { caseId, ...sendNotification } = input

    this.logger.debug(`Sending notification for case ${caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.SEND_NOTIFICATION,
      backendService.sendNotification(caseId, sendNotification),
      caseId,
    )
  }

  @Mutation(() => Case, { nullable: true })
  @UseInterceptors(CaseInterceptor)
  extendCase(
    @Args('input', { type: () => ExtendCaseInput })
    input: ExtendCaseInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<Case> {
    this.logger.debug(`Extending case ${input.id}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.EXTEND_CASE,
      backendService.extendCase(input.id),
      (theCase) => theCase.id,
    )
  }

  @Mutation(() => Case, { nullable: true })
  @UseInterceptors(CaseInterceptor)
  splitDefendantFromCase(
    @Args('input', { type: () => SplitDefendantFromCaseInput })
    input: SplitDefendantFromCaseInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<Case> {
    const { id, defendantId } = input

    this.logger.debug(`Splitting defendant ${defendantId} from case ${id}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.SPLIT_DEFENDANT_FROM_CASE,
      backendService.splitDefendantFromCase(id, defendantId),
      (theCase) => theCase.id,
    )
  }

  @Mutation(() => Case, { nullable: true })
  @UseInterceptors(CaseInterceptor)
  createCourtCase(
    @Args('input', { type: () => CreateCourtCaseInput })
    input: CreateCourtCaseInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<Case> {
    this.logger.debug(`Creating court case for case ${input.caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_COURT_CASE,
      backendService.createCourtCase(input.caseId),
      input.caseId,
    )
  }
}
