import { Inject, Logger, UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'

import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'
import {
  CurrentGraphQlUser,
  JwtGraphQlAuthUserGuard,
} from '@island.is/judicial-system/auth'
import type { User } from '@island.is/judicial-system/types'

import { BackendService } from '../backend'
import { CreateVerdictsInput } from './dto/createVerdicts.input'
import { DeliverCaseVerdictQueryInput } from './dto/deliverCaseVerdict.input'
import { UpdateVerdictInput } from './dto/updateVerdict.input'
import { VerdictQueryInput } from './dto/verdict.input'
import { DeliverCaseVerdictResponse } from './models/deliverCaseVerdict.response'
import { Verdict } from './models/verdict.model'

@UseGuards(JwtGraphQlAuthUserGuard)
@Resolver(() => Verdict)
export class VerdictResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Mutation(() => [Verdict], { nullable: true })
  createVerdicts(
    @Args('input', { type: () => CreateVerdictsInput })
    input: CreateVerdictsInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<Verdict[]> {
    this.logger.debug(`Creating verdicts for defendants in ${input.caseId}`)
    const { caseId, ...createVerdictInputs } = input

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_VERDICTS,
      backendService.createVerdicts(caseId, createVerdictInputs.verdicts ?? []),
      caseId,
    )
  }

  @Mutation(() => Verdict, { nullable: true })
  updateVerdict(
    @Args('input', { type: () => UpdateVerdictInput })
    input: UpdateVerdictInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<Verdict> {
    this.logger.debug(
      `Updating verdict for defendant ${input.defendantId} of case ${input.caseId}`,
    )
    const { caseId, defendantId, ...updateVerdict } = input

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPDATE_VERDICT,
      backendService.updateVerdict(caseId, defendantId, updateVerdict),
      defendantId,
    )
  }

  @Query(() => Verdict, { nullable: true })
  verdict(
    @Args('input', { type: () => VerdictQueryInput })
    input: VerdictQueryInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<Verdict> {
    this.logger.debug(
      `Getting verdict for defendant ${input.defendantId} of case ${input.caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_VERDICT,
      backendService.getVerdict(input.caseId, input.defendantId),
      input.caseId,
    )
  }

  @Mutation(() => DeliverCaseVerdictResponse, { nullable: true })
  deliverCaseVerdict(
    @Args('input', { type: () => DeliverCaseVerdictQueryInput })
    input: DeliverCaseVerdictQueryInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<DeliverCaseVerdictResponse> {
    this.logger.debug(
      `Delivering case verdict ${input.caseId} to affected defendants`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.DELIVER_CASE_VERDICT,
      backendService.deliverCaseVerdict(input.caseId),
      input.caseId,
    )
  }
}
