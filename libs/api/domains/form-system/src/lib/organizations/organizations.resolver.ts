import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql'
import { OrganizationsService } from './organizations.service'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { Organization } from '../../models/organization.model'
import {
  GetOrganizationAdminInput,
  GetOrganizationInput,
} from '../../dto/organization.input'
import { UseGuards } from '@nestjs/common'
import { OrganizationAdmin } from '../../models/organizationAdmin.model'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
export class OrganizationsResolver {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Query(() => Organization, {
    name: 'formSystemGetOrganization',
  })
  async getOrganization(
    @Args('input', { type: () => GetOrganizationInput })
    input: GetOrganizationInput,
    @CurrentUser() user: User,
  ): Promise<Organization> {
    return this.organizationsService.getOrganization(user, input)
  }

  @Query(() => OrganizationAdmin, {
    name: 'formSystemGetOrganizationAdmin',
  })
  async getOrganizationAdmin(
    @Args('input', { type: () => GetOrganizationAdminInput })
    input: GetOrganizationAdminInput,
    @CurrentUser() user: User,
  ): Promise<OrganizationAdmin> {
    return this.organizationsService.getOrganizationAdmin(user, input)
  }

  @Mutation(() => Organization, {
    name: 'formSystemCreateOrganization',
  })
  async createOrganization(
    @Args('input', { type: () => GetOrganizationInput })
    input: GetOrganizationInput,
    @CurrentUser() user: User,
  ): Promise<Organization> {
    return this.organizationsService.createOrganization(user, input)
  }
}
