import { Inject, UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

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
import { CreateSubpoenasInput } from './dto/createSubpoena.input'
import { SubpoenaQueryInput } from './dto/subpoena.input'
import { Subpoena } from './models/subpoena.model'

@UseGuards(JwtGraphQlAuthUserGuard)
@Resolver()
export class SubpoenaResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly backendService: BackendService,
  ) {}

  @Query(() => Subpoena, { nullable: true })
  subpoena(
    @Args('input', { type: () => SubpoenaQueryInput })
    input: SubpoenaQueryInput,
    @CurrentGraphQlUser() user: User,
  ): Promise<Subpoena> {
    this.logger.debug(
      `Getting subpoena ${input.subpoenaId} for defendant ${input.defendantId} of case ${input.caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_SUBPOENA,
      this.backendService.getSubpoena(
        input.caseId,
        input.defendantId,
        input.subpoenaId,
      ),
      input.caseId,
    )
  }

  @Mutation(() => [Subpoena])
  createSubpoenas(
    @Args('caseId', { type: () => String }) caseId: string,
    @Args('input', { type: () => CreateSubpoenasInput })
    input: CreateSubpoenasInput,
    @CurrentGraphQlUser() user: User,
  ): Promise<Subpoena[]> {
    this.logger.debug(
      `Creating subpoenas for defendants ${input.defendantIds.join(
        ', ',
      )} in case ${caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_SUBPOENAS,
      this.backendService.createSubpoenas(caseId, {
        defendantIds: input.defendantIds,
        arraignmentDate: input.arraignmentDate,
        location: input.location,
      }),
      caseId,
    )
  }
}
