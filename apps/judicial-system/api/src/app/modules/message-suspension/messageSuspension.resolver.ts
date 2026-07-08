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
import type { User as TUser } from '@island.is/judicial-system/types'

import { BackendService } from '../backend'
import { UpdateMessageSuspensionInput } from './dto/updateMessageSuspension.input'
import { MessageSuspension } from './models/messageSuspension.model'

@Resolver(() => MessageSuspension)
export class MessageSuspensionResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly backendService: BackendService,
  ) {}

  @UseGuards(JwtGraphQlAuthUserGuard)
  @Query(() => [MessageSuspension], { nullable: true })
  messageSuspensions(
    @CurrentGraphQlUser() user: TUser,
  ): Promise<MessageSuspension[]> {
    this.logger.debug('Getting all message suspensions')

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_MESSAGE_SUSPENSIONS,
      this.backendService.getMessageSuspensions(),
      (suspensions: MessageSuspension[]) =>
        suspensions.map((suspension) => suspension.category),
    )
  }

  @UseGuards(JwtGraphQlAuthUserGuard)
  @Mutation(() => MessageSuspension, { nullable: true })
  updateMessageSuspension(
    @Args('input', { type: () => UpdateMessageSuspensionInput })
    input: UpdateMessageSuspensionInput,
    @CurrentGraphQlUser() user: TUser,
  ): Promise<MessageSuspension> {
    const { category, ...updateMessageSuspension } = input

    this.logger.debug(`Updating message suspension ${category}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPDATE_MESSAGE_SUSPENSION,
      this.backendService.updateMessageSuspension(category, updateMessageSuspension),
      category,
    )
  }
}
