import { Inject, Logger, UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

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
import { CreateCivilClaimantInput } from './dto/createCivilClaimant.input'
import { DeleteCivilClaimantInput } from './dto/deleteCivilClaimant.input'
import { UpdateCivilClaimantInput } from './dto/updateCivilClaimant.input'
import { CivilClaimant } from './models/civilClaimant.model'
import { DeleteCivilClaimantResponse } from './models/deleteCivilClaimant.response'

@UseGuards(JwtGraphQlAuthUserGuard)
@Resolver(() => CivilClaimant)
export class CivilClaimantResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Mutation(() => CivilClaimant)
  createCivilClaimant(
    @Args('input', { type: () => CreateCivilClaimantInput })
    input: CreateCivilClaimantInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<CivilClaimant> {
    const { caseId, ...createCivilClaimant } = input

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_CIVIL_CLAIMANT,
      backendService.createCivilClaimant(caseId, createCivilClaimant),
      (civilClaimant) => civilClaimant.id,
    )
  }

  @Mutation(() => CivilClaimant)
  updateCivilClaimant(
    @Args('input', { type: () => UpdateCivilClaimantInput })
    input: UpdateCivilClaimantInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<CivilClaimant> {
    const { caseId, civilClaimantId, ...updateCivilClaimant } = input

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPDATE_CIVIL_CLAIMANT,
      backendService.updateCivilClaimant(
        caseId,
        civilClaimantId,
        updateCivilClaimant,
      ),
      (civilClaimant) => civilClaimant.id,
    )
  }

  @Mutation(() => DeleteCivilClaimantResponse)
  async deleteCivilClaimant(
    @Args('input', { type: () => DeleteCivilClaimantInput })
    input: DeleteCivilClaimantInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<DeleteCivilClaimantResponse> {
    const { caseId, civilClaimantId } = input

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.DELETE_CIVIL_CLAIMANT,
      backendService.deleteCivilClaimant(caseId, civilClaimantId),
      civilClaimantId,
    )
  }
}
