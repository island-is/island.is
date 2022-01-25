import { Query, Resolver, Context, Mutation, Args } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { BackendAPI } from '../../../services'

import {
  ApplicationFiltersModel,
  ApplicationWithAttachments,
  UpdateApplicationTableResponse,
} from './models'
import {
  CreateApplicationInput,
  UpdateApplicationInput,
  CreateApplicationEventInput,
  UpdateApplicationInputTable,
  ApplicationInput,
  AllApplicationInput,
  ApplicationSearchInput,
} from './dto'
import {
  Application,
  ApplicationFilters,
  UpdateApplicationTableResponseType,
} from '@island.is/financial-aid/shared/lib'
import { IdsUserGuard } from '@island.is/auth-nest-tools'

@UseGuards(IdsUserGuard)
@Resolver(() => ApplicationWithAttachments)
export class ApplicationResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Query(() => [ApplicationWithAttachments], { nullable: false })
  applications(
    @Args('input', { type: () => AllApplicationInput })
    input: AllApplicationInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Application[]> {
    this.logger.debug('Getting all applications')

    return backendApi.getApplications(input.stateUrl)
  }

  @Query(() => ApplicationWithAttachments, { nullable: false })
  application(
    @Args('input', { type: () => ApplicationInput })
    input: ApplicationInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Application> {
    this.logger.debug(`Getting application ${input.id}`)

    return backendApi.getApplication(input.id)
  }

  @Query(() => [ApplicationWithAttachments], { nullable: false })
  applicationSearch(
    @Args('input', { type: () => ApplicationSearchInput })
    input: ApplicationSearchInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Application[]> {
    this.logger.debug(`searching for application`)

    return backendApi.searchForApplication(input.nationalId)
  }

  @Mutation(() => ApplicationWithAttachments, { nullable: true })
  createApplication(
    @Args('input', { type: () => CreateApplicationInput })
    input: CreateApplicationInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Application> {
    this.logger.debug('Creating application')
    return backendApi.createApplication(input)
  }

  @Mutation(() => ApplicationWithAttachments, { nullable: true })
  updateApplication(
    @Args('input', { type: () => UpdateApplicationInput })
    input: UpdateApplicationInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Application> {
    const { id, ...updateApplication } = input
    this.logger.debug(`updating application ${id}`)
    return backendApi.updateApplication(id, updateApplication)
  }

  @Mutation(() => UpdateApplicationTableResponse, { nullable: true })
  updateApplicationTable(
    @Args('input', { type: () => UpdateApplicationInputTable })
    input: UpdateApplicationInputTable,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<UpdateApplicationTableResponseType> {
    const { id, stateUrl, ...updateApplication } = input

    this.logger.debug(`updating application table ${id}`)

    return backendApi.updateApplicationTable(id, stateUrl, updateApplication)
  }
  @Mutation(() => ApplicationFiltersModel, { nullable: false })
  applicationFilters(
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<ApplicationFilters> {
    this.logger.debug('Getting all applications filters')

    return backendApi.getApplicationFilters()
  }

  @Mutation(() => ApplicationWithAttachments, { nullable: true })
  async createApplicationEvent(
    @Args('input', { type: () => CreateApplicationEventInput })
    input: CreateApplicationEventInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Application> {
    this.logger.debug('Creating application event')

    return backendApi.createApplicationEvent(input)
  }
}
