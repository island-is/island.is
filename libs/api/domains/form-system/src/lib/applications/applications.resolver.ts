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
import {
  Application,
  ApplicationResponse,
} from '../../models/applications.model'
import {
  ApplicationsInput,
  CreateApplicationInput,
  GetApplicationInput,
  GetApplicationsInput,
  SubmitScreenInput,
  UpdateApplicationInput,
} from '../../dto/application.input'
import { UpdateApplicationDependenciesInput } from '../../dto/application.input'
import { Screen } from '../../models/screen.model'

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

  @Query(() => ApplicationResponse, {
    name: 'formSystemApplications',
  })
  async getApplications(
    @Args('input', { type: () => ApplicationsInput })
    input: ApplicationsInput,
    @CurrentUser() user: User,
  ): Promise<ApplicationResponse> {
    return this.applicationsService.getApplications(user, input)
  }

  @Query(() => ApplicationResponse, {
    name: 'formSystemGetApplications',
  })
  async getAllApplications(
    @Args('input', { type: () => GetApplicationsInput })
    input: GetApplicationsInput,
    @CurrentUser() user: User,
  ): Promise<ApplicationResponse> {
    return this.applicationsService.getAllApplications(user, input)
  }

  @Mutation(() => Application, {
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

  // @Mutation(() => SubmitScreenResponse, {
  //   name: 'submitFormSystemScreen',
  // })
  // async submitScreen(
  //   @Args('input', { type: () => SubmitScreenInput })
  //   input: SubmitScreenInput,
  //   @CurrentUser() user: User,
  // ): Promise<SubmitScreenResponse> {
  //   console.log('submitScreen', input)
  //   return this.applicationsService.submitScreen(user, input)
  // }

  @Mutation(() => Boolean, {
    name: 'updateFormSystemApplication',
  })
  async updateApplication(
    @Args('input', { type: () => UpdateApplicationInput })
    input: UpdateApplicationInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.applicationsService.updateApplication(user, input)
  }

  @Mutation(() => Screen, {
    name: 'saveFormSystemScreen',
  })
  async saveScreen(
    @Args('input', { type: () => SubmitScreenInput })
    input: SubmitScreenInput,
    @CurrentUser() user: User,
  ): Promise<Screen> {
    return this.applicationsService.saveScreen(user, input)
  }
}
