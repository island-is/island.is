import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { OrganizationsService } from './organizations.service'
import { Organization } from '../../models/organization.model'
import { GetOrganizationInput } from '../../dto/organization.input'

@Resolver()
@UseGuards(IdsUserGuard)
@Audit({ namespace: '@island.is/api/form-system' })
export class OrganizationsResolver {
  constructor(private readonly organizationsService: OrganizationsService) { }

  @Query(() => Organization, {
    name: 'formSystemGetOrganization',
  })
  async getOrganization(
    @Args('input', { type: () => GetOrganizationInput }) input: GetOrganizationInput,
    @CurrentUser() user: User,
  ): Promise<Organization> {
    return this.organizationsService.getOrganization(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemCreateOrganization',
  })
  async createOrganization(
    @Args('input', { type: () => GetOrganizationInput }) input: GetOrganizationInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.organizationsService.createOrganization(user, input)
  }
}
