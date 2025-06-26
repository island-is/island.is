import { UseGuards } from '@nestjs/common'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import {
  CreateOrganizationUrlInput,
  DeleteOrganizationUrlInput,
  UpdateOrganizationUrlInput,
} from '../../dto/organizationUrl.input'
import { OrganizationUrl } from '../../models/organizationUrl.model'
import { OrganizationUrlsService } from '../organizationUrls/organizationUrls.service'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
export class OrganizationUrlsResolver {
  constructor(
    private readonly organizationUrlsService: OrganizationUrlsService,
  ) {}

  @Mutation(() => OrganizationUrl, {
    name: 'createFormSystemOrganizationUrl',
  })
  async createOrganizationUrl(
    @Args('input', { type: () => CreateOrganizationUrlInput })
    input: CreateOrganizationUrlInput,
    @CurrentUser() user: User,
  ): Promise<OrganizationUrl> {
    return this.organizationUrlsService.createOrganizationUrl(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'updateFormSystemOrganizationUrl',
    nullable: true,
  })
  async updateOrganizationUrl(
    @Args('input', { type: () => UpdateOrganizationUrlInput })
    input: UpdateOrganizationUrlInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.organizationUrlsService.updateOrganizationUrl(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'deleteFormSystemOrganizationUrl',
    nullable: true,
  })
  async deleteOrganizationUrl(
    @Args('input', { type: () => DeleteOrganizationUrlInput })
    input: DeleteOrganizationUrlInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.organizationUrlsService.deleteOrganizationUrl(user, input)
  }
}
