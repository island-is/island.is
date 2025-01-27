import { UseGuards } from '@nestjs/common'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { ApplicationsService } from './applications.service'
import { Application, ApplicationListDto } from '../../models/applications.model'
import {
  CreateApplicationInput,
  GetApplicationInput,
  GetApplicationsByOrganizationInput,
  SubmitScreenInput,
} from '../../dto/application.input'
import { UpdateApplicationDependenciesInput } from '../../dto/applicant.input'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
@Audit({ namespace: '@island.is/api/form-system' })
export class ApplicationsResolver {
  constructor(private readonly applicationsService: ApplicationsService) { }

  @Query(() => Application, {
    name: 'formSystemGetApplication',
  })
  async getApplication(
    @Args('input', { type: () => GetApplicationInput })
    input: GetApplicationInput,
    @CurrentUser() user: User,
  ): Promise<Application> {
    return this.applicationsService.getApplication(user, input)
  }

  @Mutation(() => Application, {
    name: 'formSystemCreateApplication',
  })
  async createApplication(
    @Args('input', { type: () => CreateApplicationInput })
    input: CreateApplicationInput,
    @CurrentUser() user: User,
  ): Promise<Application> {
    return this.applicationsService.createApplication(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemUpdateApplicationDependencies',
  })
  async updateApplicationDependencies(
    @Args('input', { type: () => UpdateApplicationDependenciesInput })
    input: UpdateApplicationDependenciesInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.applicationsService.updateDependencies(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemSubmitApplication'
  })
  async submitApplication(
    @Args('input', { type: () => GetApplicationInput })
    input: GetApplicationInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.applicationsService.submitApplication(user, input)
  }

  // @Mutation(() => Boolean, {
  //   name: 'formSystemSubmitScreen',
  // })
  // async submitScreen(
  //   @Args('input', { type: () => SubmitScreenInput })
  //   input: SubmitScreenInput,
  //   @CurrentUser() user: User,
  // ): Promise<void> {
  //   return this.applicationsService.submitScreen(user, input)
  // }

  // @Query(() => ApplicationListDto, {
  //   name: 'formSystemGetApplicationsByOrganization',
  // })
  // async getApplicationsByOrganization(
  //   @Args('input', { type: () => GetApplicationsByOrganizationInput })
  //   input: GetApplicationsByOrganizationInput,
  //   @CurrentUser() user: User,
  // ): Promise<ApplicationListDto> {
  //   return this.applicationsService.getAllApplicationsByOrganization(user, input)
  // }
}
