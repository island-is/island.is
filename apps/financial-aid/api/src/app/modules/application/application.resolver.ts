import { Query, Resolver, Context, Mutation, Args } from '@nestjs/graphql'

import { Inject, UseGuards } from '@nestjs/common'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { BackendAPI } from '../../../services'

import { ApplicationModel } from './models'
import { CreateApplicationInput } from './dto'
import { JwtGraphQlAuthGuard } from '@island.is/financial-aid/auth'

import { ApplicationInput } from './dto'

@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => ApplicationModel)
export class ApplicationResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Query(() => [ApplicationModel], { nullable: false })
  applications(
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<ApplicationModel[]> {
    this.logger.debug('Getting all applications')

    return backendApi.getApplications()
  }

  @Query(() => ApplicationModel, { nullable: false })
  application(
    @Args('input', { type: () => ApplicationInput })
    input: ApplicationInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<ApplicationModel> {
    this.logger.debug(`Getting applicant ${input.id}`)

    return backendApi.getApplicant(input.id)
  }

  @Mutation(() => ApplicationModel, { nullable: true })
  createApplication(
    @Args('input', { type: () => CreateApplicationInput })
    input: CreateApplicationInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<ApplicationModel> {
    this.logger.debug('Creating case')

    return backendApi.createApplication(input)
  }
}
