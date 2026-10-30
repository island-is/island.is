import { UseGuards } from '@nestjs/common'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { OrganizationDelegationUpdateInput } from '../../dto/organizationDelegation.input'
import { OrganizationDelegationsService } from './organizationDelegations.service'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
export class OrganizationDelegationsResolver {
  constructor(
    private readonly organizationDelegationsService: OrganizationDelegationsService,
  ) {}

  @Mutation(() => Boolean, {
    name: 'createFormSystemOrganizationDelegation',
  })
  async createOrganizationDelegation(
    @Args('input', { type: () => OrganizationDelegationUpdateInput })
    input: OrganizationDelegationUpdateInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    await this.organizationDelegationsService.createOrganizationDelegation(
      user,
      input,
    )
    return true
  }

  @Mutation(() => Boolean, {
    name: 'deleteFormSystemOrganizationDelegation',
    nullable: true,
  })
  async deleteOrganizationDelegation(
    @Args('input', { type: () => OrganizationDelegationUpdateInput })
    input: OrganizationDelegationUpdateInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    await this.organizationDelegationsService.deleteOrganizationDelegation(
      user,
      input,
    )
    return true
  }
}
