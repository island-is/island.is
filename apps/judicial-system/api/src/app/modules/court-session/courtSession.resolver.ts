import { Inject, UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

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
import { CourtSessionResponse } from './dto/courtSession.response'
import { CreateCourtSessionInput } from './dto/createCourtSession.input'
import { DeleteCourtSessionInput } from './dto/deleteCourtSession.input'
import { DeleteCourtSessionResponse } from './dto/deleteCourtSession.response'
import { UpdateCourtSessionInput } from './dto/updateCourtSession.input'

@UseGuards(JwtGraphQlAuthUserGuard)
@Resolver()
export class CourtSessionResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Mutation(() => CourtSessionResponse, { nullable: true })
  createCourtSession(
    @Args('input', { type: () => CreateCourtSessionInput })
    input: CreateCourtSessionInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<CourtSessionResponse> {
    const { caseId, ...createCourtSession } = input

    this.logger.debug(`Creating a new court session for case ${caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_COURT_SESSION,
      backendService.createCourtSession(caseId, createCourtSession),
      (theCourtSession) => theCourtSession.id,
    )
  }

  @Mutation(() => CourtSessionResponse, { nullable: true })
  updateCourtSession(
    @Args('input', { type: () => UpdateCourtSessionInput })
    input: UpdateCourtSessionInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<CourtSessionResponse> {
    const { caseId, courtSessionId, ...updateCourtSession } = input

    this.logger.debug(
      `Updating court session ${courtSessionId} for case ${caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPDATE_COURT_SESSION,
      backendService.updateCourtSession(
        caseId,
        courtSessionId,
        updateCourtSession,
      ),
      courtSessionId,
    )
  }

  @Mutation(() => DeleteCourtSessionResponse, { nullable: true })
  deleteCourtSession(
    @Args('input', { type: () => DeleteCourtSessionInput })
    input: DeleteCourtSessionInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<DeleteCourtSessionResponse> {
    const { caseId, courtSessionId } = input

    this.logger.debug(
      `Deleting court session with id ${courtSessionId} in case ${caseId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.DELETE_COURT_SESSION,
      backendService.deleteCourtSession(caseId, courtSessionId),
      courtSessionId,
    )
  }
}
