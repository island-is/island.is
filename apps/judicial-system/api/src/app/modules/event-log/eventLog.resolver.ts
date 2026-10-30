import { Inject, UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  CurrentGraphQlUser,
  JwtGraphQlAuthUserGuard,
} from '@island.is/judicial-system/auth'
import type { User } from '@island.is/judicial-system/types'

import { BackendService } from '../backend'
import { CreateEventLogInput } from './dto/createEventLog.input'

@UseGuards(JwtGraphQlAuthUserGuard)
@Resolver()
export class EventLogResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly backendService: BackendService,
  ) {}

  @Mutation(() => Boolean, { nullable: true })
  createEventLog(
    @Args('input', { type: () => CreateEventLogInput })
    input: CreateEventLogInput,
    @CurrentGraphQlUser() user: User,
  ): Promise<boolean> {
    this.logger.debug(`Creating event log for case ${input.caseId}`)

    return this.backendService.createEventLog({
      ...input,
      nationalId: user.nationalId,
      userRole: user.role,
      userName: user.name,
      userTitle: user.title,
      institutionName: user.institution?.name,
    })
  }
}
