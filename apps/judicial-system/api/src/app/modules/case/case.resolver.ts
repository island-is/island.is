import {
  Query,
  Resolver,
  Context,
  Args,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql'
import { Inject, UseGuards, UseInterceptors } from '@nestjs/common'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'
import type {
  User,
  Notification as TNotification,
  CaseFile as TCaseFile,
} from '@island.is/judicial-system/types'
import {
  CurrentGraphQlUser,
  JwtGraphQlAuthGuard,
} from '@island.is/judicial-system/auth'

import { BackendAPI } from '../../../services'
import { CaseFile } from '../file'
import { CaseInterceptor, CasesInterceptor } from './interceptors'
import {
  CreateCaseInput,
  UpdateCaseInput,
  TransitionCaseInput,
  SendNotificationInput,
  RequestSignatureInput,
  SignatureConfirmationQueryInput,
  CaseQueryInput,
  ExtendCaseInput,
} from './dto'
import {
  Case,
  Notification,
  RequestSignatureResponse,
  SendNotificationResponse,
  SignatureConfirmationResponse,
} from './models'

@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => Case)
export class CaseResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Query(() => [Case], { nullable: true })
  @UseInterceptors(CasesInterceptor)
  cases(
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Case[]> {
    this.logger.debug('Getting all cases')

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_CASES,
      backendApi.getCases(),
      (cases: Case[]) => cases.map((aCase) => aCase.id),
    )
  }

  @Query(() => Case, { nullable: true })
  @UseInterceptors(CaseInterceptor)
  async case(
    @Args('input', { type: () => CaseQueryInput })
    input: CaseQueryInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Case> {
    this.logger.debug(`Getting case ${input.id}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_CASE,
      backendApi.getCase(input.id),
      input.id,
    )
  }

  @Mutation(() => Case, { nullable: true })
  @UseInterceptors(CaseInterceptor)
  createCase(
    @Args('input', { type: () => CreateCaseInput })
    input: CreateCaseInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Case> {
    this.logger.debug('Creating a new case')

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_CASE,
      backendApi.createCase(input),
      (theCase) => theCase.id,
    )
  }

  @Mutation(() => Case, { nullable: true })
  @UseInterceptors(CaseInterceptor)
  updateCase(
    @Args('input', { type: () => UpdateCaseInput })
    input: UpdateCaseInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Case> {
    const { id, ...updateCase } = input

    this.logger.debug(`Updating case ${id}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPDATE_CASE,
      backendApi.updateCase(id, updateCase),
      id,
    )
  }

  @Mutation(() => Case, { nullable: true })
  @UseInterceptors(CaseInterceptor)
  transitionCase(
    @Args('input', { type: () => TransitionCaseInput })
    input: TransitionCaseInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Case> {
    const { id, ...transitionCase } = input

    this.logger.debug(`Transitioning case ${id}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.TRANSITION_CASE,
      backendApi.transitionCase(id, transitionCase),
      id,
    )
  }

  @Mutation(() => RequestSignatureResponse, { nullable: true })
  requestSignature(
    @Args('input', { type: () => RequestSignatureInput })
    input: RequestSignatureInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<RequestSignatureResponse> {
    this.logger.debug(`Requesting signature of ruling for case ${input.caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.REQUEST_SIGNATURE,
      backendApi.requestSignature(input.caseId),
      input.caseId,
    )
  }

  @Query(() => SignatureConfirmationResponse, { nullable: true })
  signatureConfirmation(
    @Args('input', { type: () => SignatureConfirmationQueryInput })
    input: SignatureConfirmationQueryInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<SignatureConfirmationResponse> {
    const { caseId, documentToken } = input

    this.logger.debug(`Confirming signature of ruling for case ${caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CONFIRM_SIGNATURE,
      backendApi.getSignatureConfirmation(caseId, documentToken),
      caseId,
    )
  }

  @Mutation(() => SendNotificationResponse, { nullable: true })
  sendNotification(
    @Args('input', { type: () => SendNotificationInput })
    input: SendNotificationInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<SendNotificationResponse> {
    const { caseId, ...sendNotification } = input

    this.logger.debug(`Sending notification for case ${caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.SEND_NOTIFICATION,
      backendApi.sendNotification(caseId, sendNotification),
      caseId,
    )
  }

  @Mutation(() => Case, { nullable: true })
  @UseInterceptors(CaseInterceptor)
  extendCase(
    @Args('input', { type: () => ExtendCaseInput })
    input: ExtendCaseInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Case> {
    this.logger.debug(`Extending case ${input.id}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.EXTEND_CASE,
      backendApi.extendCase(input.id),
      (theCase) => theCase.id,
    )
  }

  @ResolveField(() => [Notification])
  async notifications(
    @Parent() existingCase: Case,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Notification[]> {
    const { id } = existingCase

    return backendApi
      .getCaseNotifications(id)
      .catch(() => [] as TNotification[])
  }

  @ResolveField(() => [CaseFile])
  async caseFiles(
    @Parent() existingCase: Case,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<CaseFile[]> {
    const { id } = existingCase

    return backendApi.getCaseFiles(id).catch(() => [] as TCaseFile[])
  }
}
