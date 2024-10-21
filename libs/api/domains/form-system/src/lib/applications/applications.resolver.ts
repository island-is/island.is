import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { ApplicationsService } from './applications.service'
import { Application } from '../../models/applications.model'
import {
  CreateApplicationInput,
  GetApplicationInput,
} from '../../dto/application.input'

@Resolver()
@UseGuards(IdsUserGuard)
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
}
