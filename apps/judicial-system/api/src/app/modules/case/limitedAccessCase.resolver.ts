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
import type { User } from '@island.is/judicial-system/types'

import { BackendService } from '../backend'
import { CaseQueryInput } from './dto/case.input'
import { TransitionCaseInput } from './dto/transitionCase.input'
import { UpdateCaseInput } from './dto/updateCase.input'
import { CaseInterceptor } from './interceptors/case.interceptor'
import { LimitedAccessCaseInterceptor } from './interceptors/limitedAccessCase.interceptor'
import { Case } from './models/case.model'

@UseGuards(new JwtGraphQlAuthUserGuard(true))
@Resolver(() => Case)
export class LimitedAccessCaseResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Query(() => Case, { nullable: true })
  @UseInterceptors(CaseInterceptor, LimitedAccessCaseInterceptor)
  async limitedAccessCase(
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
      backendService.limitedAccessGetCase(input.id),
      input.id,
    )
  }

  @Mutation(() => Case, { nullable: true })
  @UseInterceptors(CaseInterceptor)
  limitedAccessUpdateCase(
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
      backendService.limitedAccessUpdateCase(id, updateCase),
      id,
    )
  }

  @Mutation(() => Case, { nullable: true })
  @UseInterceptors(CaseInterceptor)
  limitedAccessTransitionCase(
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
      backendService.limitedAccessTransitionCase(id, transitionCase),
      id,
    )
  }
}
