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

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'
import { User } from '@island.is/judicial-system/types'
import {
  CurrentGraphQlUser,
  JwtGraphQlAuthGuard,
} from '@island.is/judicial-system/auth'

import { environment } from '../../../environments'
import { BackendAPI } from '../../../services'
import { CaseInterceptor, CasesInterceptor } from './interceptors'
import {
  CreateCaseInput,
  UpdateCaseInput,
  TransitionCaseInput,
  SendNotificationInput,
  RequestSignatureInput,
  SignatureConfirmationQueryInput,
  CaseQueryInput,
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
    @Inject(AuditTrailService)
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {
    auditTrailService.initTrail(environment.auditTrail)
  }

  @Query(() => [Case], { nullable: true })
  @UseInterceptors(CasesInterceptor)
  async cases(
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Case[]> {
    this.logger.debug('Getting all cases')

    const cases = await backendApi.getCases()

    this.auditTrailService.audit(
      user.id,
      AuditedAction.OVERVIEW,
      cases.map((aCase) => aCase.id),
    )

    return cases
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

    const existingCase = await backendApi.getCase(input.id)

    this.auditTrailService.audit(
      user.id,
      AuditedAction.VIEW_DETAILS,
      existingCase.id,
    )

    return existingCase
  }

  @Mutation(() => Case, { nullable: true })
  @UseInterceptors(CaseInterceptor)
  createCase(
    @Args('input', { type: () => CreateCaseInput })
    input: CreateCaseInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Case> {
    this.logger.debug('Creating case')

    return backendApi.createCase(input)
  }

  @Mutation(() => Case, { nullable: true })
  @UseInterceptors(CaseInterceptor)
  updateCase(
    @Args('input', { type: () => UpdateCaseInput })
    input: UpdateCaseInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Case> {
    const { id, ...updateCase } = input

    this.logger.debug(`Updating case ${id}`)

    return backendApi.updateCase(id, updateCase)
  }

  @Mutation(() => Case, { nullable: true })
  @UseInterceptors(CaseInterceptor)
  transitionCase(
    @Args('input', { type: () => TransitionCaseInput })
    input: TransitionCaseInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Case> {
    const { id, ...transitionCase } = input

    this.logger.debug(`Transitioning case ${id}`)

    return backendApi.transitionCase(id, transitionCase)
  }

  @Mutation(() => RequestSignatureResponse, { nullable: true })
  requestSignature(
    @Args('input', { type: () => RequestSignatureInput })
    input: RequestSignatureInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<RequestSignatureResponse> {
    this.logger.debug(`Requesting signature of ruling for case ${input.caseId}`)

    return backendApi.requestSignature(input.caseId)
  }

  @Query(() => SignatureConfirmationResponse, { nullable: true })
  signatureConfirmation(
    @Args('input', { type: () => SignatureConfirmationQueryInput })
    input: SignatureConfirmationQueryInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<SignatureConfirmationResponse> {
    const { caseId, documentToken } = input

    this.logger.debug(`Confirming signature of ruling for case ${caseId}`)

    return backendApi.getSignatureConfirmation(caseId, documentToken)
  }

  @Mutation(() => SendNotificationResponse, { nullable: true })
  sendNotification(
    @Args('input', { type: () => SendNotificationInput })
    input: SendNotificationInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<SendNotificationResponse> {
    const { caseId, ...sendNotification } = input

    this.logger.debug(`Sending notification for case ${caseId}`)

    return backendApi.sendNotification(caseId, sendNotification)
  }

  @ResolveField(() => [Notification])
  async notifications(
    @Parent() existingCase: Case,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Notification[]> {
    const { id } = existingCase

    return backendApi.getCaseNotifications(id)
  }
}
