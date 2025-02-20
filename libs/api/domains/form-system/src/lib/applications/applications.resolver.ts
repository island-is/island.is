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
import {
  ApplicationDto,
  CreateApplicationInput,
  GetApplicationInput,
} from '@island.is/form-system-dto'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
@Audit({ namespace: '@island.is/api/form-system' })
export class ApplicationsResolver {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Query(() => ApplicationDto, {
    name: 'formSystemGetApplication',
  })
  async getApplication(
    @Args('input', { type: () => GetApplicationInput })
    input: GetApplicationInput,
    @CurrentUser() user: User,
  ): Promise<ApplicationDto> {
    return this.applicationsService.getApplication(user, input)
  }

  @Mutation(() => ApplicationDto, {
    name: 'formSystemCreateApplication',
  })
  async createApplication(
    @Args('input', { type: () => CreateApplicationInput })
    input: CreateApplicationInput,
    @CurrentUser() user: User,
  ): Promise<ApplicationDto> {
    return this.applicationsService.createApplication(user, input)
  }
}
