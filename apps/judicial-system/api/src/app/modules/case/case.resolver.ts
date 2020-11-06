import { Query, Resolver, Context, Args, Mutation } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { AuthUser, CurrentAuthUser, JwtAuthGuard } from '../auth'
import {
  CreateCaseInput,
  UpdateCaseInput,
  TransitionCaseInput,
  SendNotificationInput,
  RequestSignatureInput,
  SignatureConfirmationQueryInput,
} from './dto'
import {
  Case,
  Notification,
  PendingSignature,
  SignatureResponse,
} from './models'
import { CaseQueryInput } from './dto/case.input'

@UseGuards(JwtAuthGuard)
@Resolver(() => Case)
export class CaseResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Query(() => [Case], { nullable: true })
  cases(@Context('dataSources') { backendApi }): Promise<Case[]> {
    this.logger.debug('Getting all cases')

    return backendApi.getCases()
  }

  @Query(() => Case, { nullable: true })
  case(
    @Args('input', { type: () => CaseQueryInput })
    input: CaseQueryInput,
    @Context('dataSources') { backendApi },
  ): Promise<Case> {
    this.logger.debug(`Getting case ${input.id}`)

    return backendApi.getCase(input.id)
  }

  @Mutation(() => Case, { nullable: true })
  createCase(
    @Args('input', { type: () => CreateCaseInput })
    input: CreateCaseInput,
    @Context('dataSources') { backendApi },
  ): Promise<Case> {
    this.logger.debug('Creating case')

    return backendApi.createCase(input)
  }

  @Mutation(() => Case, { nullable: true })
  updateCase(
    @Args('input', { type: () => UpdateCaseInput })
    input: UpdateCaseInput,
    @Context('dataSources') { backendApi },
  ): Promise<Case> {
    const { id, ...updateCase } = input

    this.logger.debug(`Updating case ${id}`)

    return backendApi.updateCase(id, updateCase)
  }

  @Mutation(() => Case, { nullable: true })
  transitionCase(
    @Args('input', { type: () => TransitionCaseInput })
    input: TransitionCaseInput,
    @CurrentAuthUser() authUser: AuthUser,
    @Context('dataSources') { backendApi },
  ): Promise<Case> {
    const { id, ...transitionCase } = input

    this.logger.debug(`Transitioning case ${id}`)

    return backendApi.transitionCase(id, authUser.nationalId, transitionCase)
  }

  @Mutation(() => Notification, { nullable: true })
  sendNotification(
    @Args('input', { type: () => SendNotificationInput })
    input: SendNotificationInput,
    @CurrentAuthUser() authUser: AuthUser,
    @Context('dataSources') { backendApi },
  ): Promise<void> {
    const { caseId, ...sendNotification } = input

    this.logger.debug(`Sending notification for case ${caseId}`)

    return backendApi.sendNotification(
      caseId,
      authUser.nationalId,
      sendNotification,
    )
  }

  @Mutation(() => PendingSignature, { nullable: true })
  requestSignature(
    @Args('input', { type: () => RequestSignatureInput })
    input: RequestSignatureInput,
    @Context('dataSources') { backendApi },
  ): Promise<PendingSignature> {
    this.logger.debug(`Requesting signature of ruling for case ${input.caseId}`)

    return backendApi.requestSignature(input.caseId)
  }

  @Query(() => SignatureResponse, { nullable: true })
  confirmSignature(
    @Args('input', { type: () => SignatureConfirmationQueryInput })
    input: SignatureConfirmationQueryInput,
    @Context('dataSources') { backendApi },
  ): Promise<SignatureResponse> {
    const { caseId, documentToken } = input

    this.logger.debug(`Confirming signature of ruling for case ${caseId}`)

    return backendApi.confirmSignature(caseId, documentToken)
  }
}
