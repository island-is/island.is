import { Query, Resolver, Context, Mutation, Args } from '@nestjs/graphql'

import { Inject, UseGuards } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { BackendAPI } from '../../../services'

import { ApplicationEventModel } from './models'
import { CreateApplicationEventInput } from './dto'
import { JwtGraphQlAuthGuard } from '@island.is/financial-aid/auth'

import { ApplicationEventInput } from './dto'

import { ApplicationEvent } from '@island.is/financial-aid/shared/lib'

@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => ApplicationEventModel)
export class ApplicationEventResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Query(() => [ApplicationEventModel], { nullable: false })
  applicationEvents(
    @Args('input', { type: () => ApplicationEventInput })
    input: ApplicationEventInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<ApplicationEvent[]> {
    this.logger.debug(`Getting application event ${input.id}`)

    return backendApi.getApplicationEvents(input.id)
  }

  @Mutation(() => ApplicationEventModel, { nullable: true })
  createApplicationEvent(
    @Args('input', { type: () => CreateApplicationEventInput })
    input: CreateApplicationEventInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<ApplicationEvent> {
    this.logger.debug('Creating application event')
    return backendApi.createApplicationEvent(input)
  }
}
