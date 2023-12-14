import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { UniversityGatewayApi } from '../universityGateway.service'
import { UniversityGatewayUniversity } from './models'
import { Loader } from '@island.is/nest/dataloader'
import {
  OrganizationLogoByKeyLoader,
  OrganizationTitleByKeyLoader,
} from '@island.is/cms'
import type {
  LogoUrl,
  OrganizationLogoByKeyDataLoader,
  OrganizationTitleByKeyDataLoader,
  ShortTitle,
} from '@island.is/cms'

@Resolver(UniversityGatewayUniversity)
export class UniversityResolver {
  constructor(private readonly universityGatewayApi: UniversityGatewayApi) {}

  @Query(() => [UniversityGatewayUniversity])
  universityGatewayUniversities() {
    return this.universityGatewayApi.getUniversities()
  }

  @ResolveField('contentfulLogoUrl', () => String, { nullable: true })
  async resolveContentfulLogoUrl(
    @Loader(OrganizationLogoByKeyLoader)
    organizationLogoLoader: OrganizationLogoByKeyDataLoader,
    @Parent() university: UniversityGatewayUniversity,
  ): Promise<LogoUrl> {
    return await organizationLogoLoader.load(university.contentfulKey)
  }

  @ResolveField('contentfulTitle', () => String, { nullable: true })
  async resolveContentfulTitle(
    @Loader(OrganizationTitleByKeyLoader)
    organizationTitleLoader: OrganizationTitleByKeyDataLoader,
    @Parent() university: UniversityGatewayUniversity,
  ): Promise<ShortTitle> {
    return organizationTitleLoader.load(university.contentfulKey)
  }
}
