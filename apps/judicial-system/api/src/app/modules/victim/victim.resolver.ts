import { Inject, Logger, UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'

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
import { CreateVictimInput } from './dto/createVictim.input'
import { DeleteVictimInput } from './dto/deleteVictim.input'
import { UpdateVictimInput } from './dto/updateVictim.input'
import { DeleteVictimResponse } from './models/deleteVictim.response'
import { Victim } from './models/victim.model'

@UseGuards(JwtGraphQlAuthUserGuard)
@Resolver(() => Victim)
export class VictimResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly backendService: BackendService,
  ) {}

  @Mutation(() => Victim)
  createVictim(
    @Args('input', { type: () => CreateVictimInput })
    input: CreateVictimInput,
    @CurrentGraphQlUser() user: User,
  ): Promise<Victim> {
    const { caseId, ...createVictim } = input

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_VICTIM,
      this.backendService.createVictim(caseId, createVictim),
      (victim) => victim.id,
    )
  }

  @Mutation(() => Victim)
  updateVictim(
    @Args('input', { type: () => UpdateVictimInput })
    input: UpdateVictimInput,
    @CurrentGraphQlUser() user: User,
  ): Promise<Victim> {
    const { caseId, victimId, ...updateVictim } = input

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPDATE_VICTIM,
      this.backendService.updateVictim(caseId, victimId, updateVictim),
      (victim) => victim.id,
    )
  }

  @Mutation(() => DeleteVictimResponse)
  async deleteVictim(
    @Args('input', { type: () => DeleteVictimInput })
    input: DeleteVictimInput,
    @CurrentGraphQlUser() user: User,
  ): Promise<DeleteVictimResponse> {
    const { caseId, victimId } = input

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.DELETE_VICTIM,
      this.backendService.deleteVictim(caseId, victimId),
      victimId,
    )
  }
}
