import { Inject, UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { User } from '@island.is/judicial-system/types'
import { AuditedAction } from '@island.is/judicial-system/audit-trail'
import {
  CurrentGraphQlUser,
  JwtGraphQlAuthGuard,
} from '@island.is/judicial-system/auth'

import { AuditService } from '../audit'
import { CreateCustodyCourtCaseInput } from './dto'
import { CreateCustodyCourtCaseResponse } from './models'
import { CourtService } from './court.service'

@UseGuards(JwtGraphQlAuthGuard)
@Resolver()
export class CourtResolver {
  constructor(
    private readonly auditService: AuditService,
    private readonly courtService: CourtService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Mutation(() => CreateCustodyCourtCaseResponse, { nullable: true })
  createCustodyCourtCase(
    @Args('input', { type: () => CreateCustodyCourtCaseInput })
    input: CreateCustodyCourtCaseInput,
    @CurrentGraphQlUser() user: User,
  ): Promise<CreateCustodyCourtCaseResponse> {
    const { caseId, policeCaseNumber } = input

    this.logger.info(`Creating custody court case for case ${caseId}`)

    return this.auditService.audit(
      user.id,
      AuditedAction.CREATE_CUSTODY_COURT_CASE,
      this.courtService.createCustodyCourtCase(policeCaseNumber),
      caseId,
    )
  }
}
