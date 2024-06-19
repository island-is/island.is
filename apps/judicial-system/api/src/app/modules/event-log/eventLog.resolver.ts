import { Inject, UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  CurrentGraphQlUser,
  JwtGraphQlAuthGuard,
} from '@island.is/judicial-system/auth'
import type { User } from '@island.is/judicial-system/types'

import { BackendApi } from '../../data-sources'
import { CreateEventLogInput } from '../event-log/dto/createEventLog.input'

@UseGuards(JwtGraphQlAuthGuard)
@Resolver()
export class EventLogResolver {
constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Mutation(() => Boolean, { nullable: true })
  createEventLog(
    @Args('input', { type: () => CreateEventLogInput })
    input: CreateEventLogInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendApi },
  ): boolean {
    this.logger.debug(`Creating event log for case ${input.caseId}`)

    backendApi.createEventLog(input, user.role)

    return true
  }
}
