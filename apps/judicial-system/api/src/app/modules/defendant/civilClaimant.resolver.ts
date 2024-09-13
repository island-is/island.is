import { Inject, Logger, UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'
import {
  CurrentGraphQlUser,
  JwtGraphQlAuthGuard,
} from '@island.is/judicial-system/auth'
import type { User } from '@island.is/judicial-system/types'

import { BackendService } from '../backend'
import { CreateCivilClaimantInput } from './dto/createCivilClaimant.input'
import { CivilClaimant } from './models/civilClaimant.model'

@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => CivilClaimant)
export class CivilClaimantResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Mutation(() => CivilClaimant)
  async createCivilClaimant(
    @Args('createCivilClaimantDto')
    input: CreateCivilClaimantInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<CivilClaimant> {
    const { caseId, defendantId, ...createCivilClaimant } = input

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_CIVIL_CLAIMANT,
      backendService.createCivilClaimant(
        caseId,
        defendantId,
        createCivilClaimant,
      ),
      (civilClaimant) => civilClaimant.id,
    )
  }
}
