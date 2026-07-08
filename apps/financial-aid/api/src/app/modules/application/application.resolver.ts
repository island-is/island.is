import { Query, Resolver, Mutation, Args } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { BackendAPI } from '../../../services'

import {
  ApplicationFiltersModel,
  ApplicationModel,
  FilterApplicationsResponse,
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
  FilterApplicationsInput,
} from './dto'
import {
  Application,
  ApplicationFilters,
  ApplicationPagination,
  UpdateApplicationTableResponseType,
} from '@island.is/financial-aid/shared/lib'
import { IdsUserGuard } from '@island.is/auth-nest-tools'

@UseGuards(IdsUserGuard)
@Resolver(() => ApplicationModel)
export class ApplicationResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly backendApi: BackendAPI,
  ) {}

  @Query(() => [ApplicationModel], { nullable: false })
  applications(
    @Args('input', { type: () => AllApplicationInput })
    input: AllApplicationInput,  ): Promise<Application[]> {
    this.logger.debug('Getting all applications')

    return this.backendApi.getApplications(input.stateUrl)
  }

  @Query(() => ApplicationModel, { nullable: false })
  application(
    @Args('input', { type: () => ApplicationInput })
    input: ApplicationInput,  ): Promise<Application> {
    this.logger.debug(`Getting application ${input.id}`)

    return this.backendApi.getApplication(input.id)
  }

  @Query(() => [ApplicationModel], { nullable: false })
  applicationSearch(
    @Args('input', { type: () => ApplicationSearchInput })
    input: ApplicationSearchInput,  ): Promise<Application[]> {
    this.logger.debug(`searching for application`)

    return this.backendApi.searchForApplication(input.nationalId)
  }

  @Mutation(() => ApplicationModel, { nullable: true })
  createApplication(
    @Args('input', { type: () => CreateApplicationInput })
    input: CreateApplicationInput,  ): Promise<Application> {
    this.logger.debug('Creating application')
    return this.backendApi.createApplication(input)
  }

  @Mutation(() => ApplicationModel, { nullable: true })
  updateApplication(
    @Args('input', { type: () => UpdateApplicationInput })
    input: UpdateApplicationInput,  ): Promise<Application> {
    const { id, ...updateApplication } = input
    this.logger.debug(`updating application ${id}`)
    return this.backendApi.updateApplication(id, updateApplication)
  }

  @Mutation(() => UpdateApplicationTableResponse, { nullable: true })
  updateApplicationTable(
    @Args('input', { type: () => UpdateApplicationInputTable })
    input: UpdateApplicationInputTable,  ): Promise<UpdateApplicationTableResponseType> {
    const { id, stateUrl, ...updateApplication } = input

    this.logger.debug(`updating application table ${id}`)

    return this.backendApi.updateApplicationTable(id, stateUrl, updateApplication)
  }
  @Mutation(() => ApplicationFiltersModel, { nullable: false })
  applicationFilters(  ): Promise<ApplicationFilters> {
    this.logger.debug('Getting all applications filters')

    return this.backendApi.getApplicationFilters()
  }

  @Mutation(() => ApplicationModel, { nullable: true })
  async createApplicationEvent(
    @Args('input', { type: () => CreateApplicationEventInput })
    input: CreateApplicationEventInput,  ): Promise<Application> {
    this.logger.debug('Creating application event')

    return this.backendApi.createApplicationEvent(input)
  }

  @Query(() => FilterApplicationsResponse, { nullable: false })
  filterApplications(
    @Args('input', { type: () => FilterApplicationsInput })
    input: FilterApplicationsInput,  ): Promise<ApplicationPagination> {
    this.logger.debug(`filter applications`)
    return this.backendApi.getFilteredApplications(input)
  }
}
