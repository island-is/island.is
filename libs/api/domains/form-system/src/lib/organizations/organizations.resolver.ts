import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { Args, Resolver, Query } from '@nestjs/graphql'
import { OrganizationsService } from './organizations.service'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { GetOrganizationAdminInput } from '../../dto/organization.input'
import { UseGuards } from '@nestjs/common'
import { OrganizationAdmin } from '../../models/organizationAdmin.model'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
export class OrganizationsResolver {
  constructor(private readonly organizationsService: OrganizationsService) {}

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
}
