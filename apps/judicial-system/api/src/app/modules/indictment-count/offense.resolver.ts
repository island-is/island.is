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
import { CreateOffenseInput } from './dto/createOffense.input'
import { DeleteOffenseInput } from './dto/deleteOffense.input'
import { UpdateOffenseInput } from './dto/updateOffense.input'
import { DeleteResponse } from './models/delete.response'
import { Offense } from './models/offense.model'

@UseGuards(JwtGraphQlAuthUserGuard)
@Resolver()
export class OffenseResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Mutation(() => Offense, { nullable: true })
  createOffense(
    @Args('input', { type: () => CreateOffenseInput })
    input: CreateOffenseInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<Offense> {
    this.logger.debug(
      `Creating an offense for indictment count ${input.indictmentCountId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_OFFENSE,
      backendService.createOffense(input),
      (theOffense) => theOffense.id,
    )
  }

  @Mutation(() => Offense, { nullable: true })
  updateOffense(
    @Args('input', { type: () => UpdateOffenseInput })
    input: UpdateOffenseInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<Offense> {
    this.logger.debug(
      `Updating an offense ${input.offenseId} for indictment count ${input.indictmentCountId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPDATE_OFFENSE,
      backendService.updateOffense(input),
      input.offenseId,
    )
  }

  @Mutation(() => DeleteResponse, { nullable: true })
  deleteOffense(
    @Args('input', { type: () => DeleteOffenseInput })
    input: DeleteOffenseInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<DeleteResponse> {
    this.logger.debug(
      `Deleting an offense ${input.offenseId} for indictment count ${input.indictmentCountId}`,
    )

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.DELETE_OFFENSE,
      backendService.deleteOffense(input),
      input.offenseId,
    )
  }
}
