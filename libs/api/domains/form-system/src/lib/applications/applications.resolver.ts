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
  ApplicationResponse,
  SubmitApplicationResponse,
} from '../../models/applications.model'
import {
  ApplicationsInput,
  CreateApplicationInput,
  GetApplicationInput,
  GetApplicationsInput,
  SubmitScreenInput,
  UpdateApplicationInput,
} from '../../dto/application.input'
import { NotificationResponse } from '../../models/screen.model'
import { NotificationRequestInput } from '../../dto/notification.input'

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
    name: 'updateFormSystemApplicationSettings',
    nullable: true,
  })
  async updateApplicationSettings(
    @Args('input', { type: () => UpdateApplicationInput })
    input: UpdateApplicationInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.applicationsService.updateSettings(user, input)
  }

  @Mutation(() => SubmitApplicationResponse, {
    name: 'submitFormSystemApplication',
    nullable: true,
  })
  async submitApplication(
    @Args('input', { type: () => GetApplicationInput })
    input: GetApplicationInput,
    @CurrentUser() user: User,
  ): Promise<SubmitApplicationResponse> {
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

  @Mutation(() => Boolean, {
    name: 'saveFormSystemScreen',
    nullable: true,
  })
  async saveScreen(
    @Args('input', { type: () => SubmitScreenInput })
    input: SubmitScreenInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.applicationsService.saveScreen(user, input)
  }

  @Mutation(() => NotificationResponse, {
    name: 'notifyFormSystemExternalSystem',
    nullable: true,
  })
  async notifyExternalSystem(
    @Args('input', { type: () => NotificationRequestInput })
    input: NotificationRequestInput,
    @CurrentUser() user: User,
  ): Promise<NotificationResponse> {
    return this.applicationsService.notifyExternalSystem(user, input)
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
