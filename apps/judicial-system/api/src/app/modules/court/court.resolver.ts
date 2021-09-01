import { Inject, UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import type { CaseType, User } from '@island.is/judicial-system/types'
import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'
import {
  CurrentGraphQlUser,
  JwtGraphQlAuthGuard,
} from '@island.is/judicial-system/auth'

import { BackendAPI } from '../../../services'
import { Case } from '../case'
import { CreateCourtCaseInput } from './dto'
import { CourtService } from './court.service'

@UseGuards(JwtGraphQlAuthGuard)
@Resolver()
export class CourtResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    private readonly courtService: CourtService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private async createAndUpdate(
    backendApi: BackendAPI,
    caseId: string,
    courtId: string,
    type: CaseType,
    policeCaseNumber: string,
    isExtension: boolean,
  ): Promise<Case> {
    const courtCaseNumber = await this.courtService.createCourtCase(
      courtId,
      type,
      policeCaseNumber,
      isExtension,
    )

    return backendApi.updateCase(caseId, {
      courtCaseNumber,
    })
  }

  @Mutation(() => Case, { nullable: true })
  createCourtCase(
    @Args('input', { type: () => CreateCourtCaseInput })
    input: CreateCourtCaseInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Case> {
    const { caseId, courtId, type, policeCaseNumber, isExtension } = input

    this.logger.debug(`Creating custody court case for case ${caseId}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_COURT_CASE,
      this.createAndUpdate(
        backendApi,
        caseId,
        courtId,
        type,
        policeCaseNumber,
        isExtension,
      ),
      caseId,
    )
  }
}
