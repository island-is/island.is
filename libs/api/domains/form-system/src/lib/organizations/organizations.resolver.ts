import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import {
  Args,
  Mutation,
  Resolver,
  Query,
  // ResolveField,
  // Parent,
} from '@nestjs/graphql'
import { OrganizationsService } from './organizations.service'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { UseGuards } from '@nestjs/common'
import {
  GetOrganizationInput,
  OrganizationDto,
} from '@island.is/form-system-dto'
// import { OrganizationTitleByNationalIdLoader } from '@island.is/cms'
// import type { OrganizationTitleByNationalIdDataLoader } from '@island.is/cms'
// import { Loader } from '@island.is/nest/dataloader'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
@Audit({ namespace: '@island.is/api/form-system' })
export class OrganizationsResolver {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Query(() => OrganizationDto, {
    name: 'formSystemGetOrganization',
  })
  async getOrganization(
    @Args('input', { type: () => GetOrganizationInput })
    input: GetOrganizationInput,
    @CurrentUser() user: User,
  ): Promise<OrganizationDto> {
    return this.organizationsService.getOrganization(user, input)
  }

  // @Mutation(() => OrganizationDto, {
  //   name: 'formSystemCreateOrganization',
  // })
  // async createOrganization(
  //   @Args('input', { type: () => GetOrganizationInput })
  //   input: GetOrganizationInput,
  //   @CurrentUser() user: User,
  // ): Promise<OrganizationDto> {
  //   return this.organizationsService.createOrganization(user, input)
  // }
}

// @Resolver(() => OrganizationTitle)
// @UseGuards(IdsUserGuard)
// @CodeOwner(CodeOwners.Advania)
// @Audit({ namespace: '@island.is/api/form-system' })
// export class OrganizationTitleResolver {
//   @ResolveField('name', () => String, { nullable: true })
//   async resolveOrganizationTitle(
//     @Loader(OrganizationTitleByNationalIdLoader)
//     organizationTitleLoader: OrganizationTitleByNationalIdDataLoader,
//     @Parent() organization: Organization,
//   ): Promise<OrganizationTitle | undefined> {
//     return organizationTitleLoader.load(organization.nationalId)
//   }
// }
