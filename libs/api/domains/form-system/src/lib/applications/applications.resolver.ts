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
import { ApplicationResponse } from '../../models/applications.model'
import {
  ApplicationsInput,
  CreateApplicationInput,
  GetApplicationInput,
  GetApplicationsInput,
  SubmitScreenInput,
  SubmitSectionInput,
  UpdateApplicationInput,
} from '../../dto/application.input'
import { Screen } from '../../models/screen.model'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
export class ApplicationsResolver {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Query(() => ApplicationResponse, {
    name: 'formSystemApplication',
  })
  async getApplication(
    @Args('input', { type: () => GetApplicationInput })
    input: GetApplicationInput,
    @CurrentUser() user: User,
  ): Promise<ApplicationResponse> {
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

  @Mutation(() => ApplicationResponse, {
    name: 'createFormSystemApplication',
  })
  async createApplication(
    @Args('input', { type: () => CreateApplicationInput })
    input: CreateApplicationInput,
    @CurrentUser() user: User,
  ): Promise<ApplicationResponse> {
    return this.applicationsService.createApplication(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'updateFormSystemApplicationDependencies',
    nullable: true,
  })
  async updateApplicationDependencies(
    @Args('input', { type: () => UpdateApplicationInput })
    input: UpdateApplicationInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.applicationsService.updateDependencies(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'submitFormSystemApplication',
    nullable: true,
  })
  async submitApplication(
    @Args('input', { type: () => GetApplicationInput })
    input: GetApplicationInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.applicationsService.submitApplication(user, input)
  }

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

  @Mutation(() => Boolean, {
    name: 'submitFormSystemSection',
    nullable: true,
  })
  async submitSection(
    @Args('input', { type: () => SubmitSectionInput })
    input: SubmitSectionInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.applicationsService.submitSection(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'deleteFormSystemApplication',
    nullable: true,
  })
  async deleteApplication(
    @Args('input', { type: () => String })
    input: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.applicationsService.deleteApplication(user, input)
  }
}
