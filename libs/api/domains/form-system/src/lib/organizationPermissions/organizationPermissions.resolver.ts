import { UseGuards } from '@nestjs/common'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { OrganizationPermissionDto } from '../../models/organizationPermission.model'
import { OrganizationPermissionUpdateInput } from '../../dto/organizationPermission.input'
import { OrganizationPermissionsService } from './organizationPermissions.service'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
export class OrganizationPermissionsResolver {
  constructor(
    private readonly organizationPermissionsService: OrganizationPermissionsService,
  ) {}

  @Mutation(() => OrganizationPermissionDto, {
    name: 'createFormSystemOrganizationPermission',
  })
  async createOrganizationPermission(
    @Args('input', { type: () => OrganizationPermissionUpdateInput })
    input: OrganizationPermissionUpdateInput,
    @CurrentUser() user: User,
  ): Promise<OrganizationPermissionDto> {
    return this.organizationPermissionsService.createOrganizationPermission(
      user,
      input,
    )
  }

  @Mutation(() => Boolean, {
    name: 'deleteFormSystemOrganizationPermission',
    nullable: true,
  })
  async deleteOrganizationPermission(
    @Args('input', { type: () => OrganizationPermissionUpdateInput })
    input: OrganizationPermissionUpdateInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.organizationPermissionsService.deleteOrganizationPermission(
      user,
      input,
    )
  }
}
