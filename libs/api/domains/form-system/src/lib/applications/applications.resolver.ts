import { UseGuards } from '@nestjs/common'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { ApplicationsService } from './applications.service'
import { Application } from '../../models/applications.model'
import {
  CreateApplicationInput,
  GetApplicationInput,
  SubmitScreenInput,
} from '../../dto/application.input'
import { UpdateApplicationDependenciesInput } from '../../dto/application.input'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
export class ApplicationsResolver {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Query(() => Application, {
    name: 'formSystemApplication',
  })
  async getApplication(
    @Args('input', { type: () => GetApplicationInput })
    input: GetApplicationInput,
    @CurrentUser() user: User,
  ): Promise<Application> {
    return this.applicationsService.getApplication(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'createFormSystemApplication',
  })
  async createApplication(
    @Args('input', { type: () => CreateApplicationInput })
    input: CreateApplicationInput,
    @CurrentUser() user: User,
  ): Promise<Application> {
    return this.applicationsService.createApplication(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'updateFormSystemApplicationDependencies',
  })
  async updateApplicationDependencies(
    @Args('input', { type: () => UpdateApplicationDependenciesInput })
    input: UpdateApplicationDependenciesInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.applicationsService.updateDependencies(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'submitFormSystemApplication',
  })
  async submitApplication(
    @Args('input', { type: () => GetApplicationInput })
    input: GetApplicationInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.applicationsService.submitApplication(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'submitFormSystemScreen',
  })
  async submitScreen(
    @Args('input', { type: () => SubmitScreenInput })
    input: SubmitScreenInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.applicationsService.submitScreen(user, input)
  }
}
