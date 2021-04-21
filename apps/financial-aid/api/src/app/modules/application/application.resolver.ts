import { Query, Resolver, Context } from '@nestjs/graphql'

import { Inject } from '@nestjs/common'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { BackendAPI } from '../../../services'

import { ApplicationModel } from './models'

@Resolver(() => ApplicationModel)
export class ApplicationResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Query(() => [ApplicationModel], { nullable: true })
  applications(
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<ApplicationModel[]> {
    this.logger.debug('Getting all applications')

    return backendApi.getApplications()
  }
}
