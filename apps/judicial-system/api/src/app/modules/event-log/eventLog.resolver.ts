import { Inject, UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  CurrentGraphQlUser,
  JwtGraphQlAuthGuard,
} from '@island.is/judicial-system/auth'
import type { User } from '@island.is/judicial-system/types'

import { BackendService } from '../backend'
import { CreateEventLogInput } from './dto/createEventLog.input'

@UseGuards(JwtGraphQlAuthGuard)
@Resolver()
export class EventLogResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Mutation(() => Boolean, { nullable: true })
  async createEventLog(
    @Args('input', { type: () => CreateEventLogInput })
    input: CreateEventLogInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<boolean> {
    this.logger.debug(`Creating event log for case ${input.caseId}`)

    const res = await backendService.createEventLog({
      ...input,
      nationalId: user.nationalId,
      userRole: user.role,
      userName: user.name,
      userTitle: user.title,
      institutionName: user.institution?.name,
    })

    return res.ok
  }
}
