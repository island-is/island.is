import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { Args, Resolver, Query, Mutation } from '@nestjs/graphql'
import { OrganizationsService } from './organizations.service'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import {
  CreateOrganizationInput,
  GetOrganizationAdminInput,
} from '../../dto/organization.input'
import { NotFoundException, UseGuards } from '@nestjs/common'
import { Loader } from '@island.is/nest/dataloader'
import {
  OrganizationTitleByNationalIdLoader,
  type OrganizationTitleByNationalIdDataLoader,
} from '@island.is/cms'
import { OrganizationAdmin } from '../../models/organizationAdmin.model'
import { OrganizationZendeskInstanceInput } from '../../dto/organizationZendeskInstance.input'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
export class OrganizationsResolver {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Mutation(() => String, { name: 'createFormSystemOrganization' })
  async createOrganization(
    @Args('input', { type: () => CreateOrganizationInput })
    input: CreateOrganizationInput,
    @Loader(OrganizationTitleByNationalIdLoader)
    organizationTitleLoader: OrganizationTitleByNationalIdDataLoader,
    @CurrentUser() user: User,
  ): Promise<string> {
    const title = await organizationTitleLoader.load(input.nationalId)

    if (!title?.trim()) {
      throw new NotFoundException('Organization not found in Contentful')
    }

    await this.organizationsService.createOrganization(user, input)
    return title
  }

  @Query(() => OrganizationAdmin, {
    name: 'formSystemOrganizationAdmin',
  })
  async getOrganizationAdmin(
    @Args('input', { type: () => GetOrganizationAdminInput })
    input: GetOrganizationAdminInput,
    @CurrentUser() user: User,
  ): Promise<OrganizationAdmin> {
    return this.organizationsService.getOrganizationAdmin(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemUpdateOrganizationZendeskInstance',
    nullable: true,
  })
  async updateOrganizationZendeskInstance(
    @Args('input', { type: () => OrganizationZendeskInstanceInput })
    input: OrganizationZendeskInstanceInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.organizationsService.updateOrganizationZendeskInstance(
      user,
      input,
    )
  }
}
