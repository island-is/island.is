// import { Resolver, Query, Args, Parent, InputType } from '@nestjs/graphql'
// import {
//   OrganizationTitleByNationalIdDataLoader,
//   OrganizationTitleByNationalIdLoader,
//   ShortTitle,
// } from 'libs/cms/src/lib/loaders/organizationTitleByNationalId.loader'
// // import type { OrganizationLogoByNationalIdDataLoader } from '@island.is/cms'
// import { UseGuards } from '@nestjs/common'
// import { CodeOwner } from '@island.is/nest/core'
// import { Audit } from '@island.is/nest/audit'
// import { IdsUserGuard } from '@island.is/auth-nest-tools'
// import { CodeOwners } from '@island.is/shared/constants'
// import { Loader } from '@island.is/nest/dataloader'
// // import { CmsContentfulService } from '../cms.contentful.service'

// // @Resolver()
// // export class OrganizationTitlesResolver {
// //   constructor(
// //     // private readonly cmsContentfulService: CmsContentfulService,
// //     private readonly organizationTitleByNationalIdLoader: OrganizationTitleByNationalIdLoader,
// //   ) {}

// //   @Query(() => [String], { name: 'getOrganizationTitles' })
// //   async getOrganizationTitles(
// //     @Args('organizationNationalIds', { type: () => [String] })
// //     organizationNationalIds: string[],
// //   ): Promise<ShortTitle[]> {
// //     return this.organizationTitleByNationalIdLoader.loadOrganizationTitle(
// //       organizationNationalIds,
// //     )
// //   }
// // }

// @Resolver()
// @UseGuards(IdsUserGuard)
// @CodeOwner(CodeOwners.Advania)
// @Audit({ namespace: '@island.is/api/form-system' })
// export class OrganizationTitlesResolver {
//   async resolveOrganizationTitle(
//     @Loader(OrganizationTitleByNationalIdLoader)
//     organizationTitleLoader: OrganizationTitleByNationalIdDataLoader,
//     @Args('organizationNationalIds', { type: () => [String] })
//     input: string[],
//     // @Parent() nationalIds: String[],
//   ): Promise<Array<ShortTitle>> {
//     return organizationTitleLoader.load(input)
//   }
// }
