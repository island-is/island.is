import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { Loader } from '@island.is/nest/dataloader'
import { CacheControl, CacheControlOptions } from '@island.is/nest/graphql'
import { CACHE_CONTROL_MAX_AGE } from '@island.is/shared/constants'
import {
  OrganizationLinkByReferenceIdLoader,
  OrganizationLogoLoader,
  OrganizationTitleByReferenceIdLoader,
} from '@island.is/cms'
import type {
  LogoUrl,
  OrganizationLink,
  OrganizationLinkByReferenceIdDataLoader,
  OrganizationLogoDataLoader,
  OrganizationTitleByReferenceIdDataLoader,
  ShortTitle,
} from '@island.is/cms'
import { UniversityGatewayApi } from '../universityGateway.service'
import { UniversityGatewayUniversity } from './models'

const defaultCache: CacheControlOptions = { maxAge: CACHE_CONTROL_MAX_AGE }

@Resolver(UniversityGatewayUniversity)
export class UniversityResolver {
  constructor(private readonly universityGatewayApi: UniversityGatewayApi) {}

  @CacheControl(defaultCache)
  @Query(() => [UniversityGatewayUniversity])
  universityGatewayUniversities() {
    return this.universityGatewayApi.getUniversities()
  }

  @CacheControl(defaultCache)
  @ResolveField('contentfulLogoUrl', () => String, { nullable: true })
  async resolveContentfulLogoUrl(
    @Loader(OrganizationLogoLoader)
    organizationLogoLoader: OrganizationLogoDataLoader,
    @Parent() university: UniversityGatewayUniversity,
  ): Promise<LogoUrl> {
    return await organizationLogoLoader.load({
      key: university.contentfulKey,
      field: 'referenceIdentifier',
    })
  }

  @CacheControl(defaultCache)
  @ResolveField('contentfulTitle', () => String, { nullable: true })
  async resolveContentfulTitle(
    @Loader(OrganizationTitleByReferenceIdLoader)
    organizationTitleLoader: OrganizationTitleByReferenceIdDataLoader,
    @Parent() university: UniversityGatewayUniversity,
  ): Promise<ShortTitle> {
    return organizationTitleLoader.load(university.contentfulKey)
  }

  @CacheControl(defaultCache)
  @ResolveField('contentfulLink', () => String, { nullable: true })
  async resolveContentfulLink(
    @Loader(OrganizationLinkByReferenceIdLoader)
    organizationLinkLoader: OrganizationLinkByReferenceIdDataLoader,
    @Parent() university: UniversityGatewayUniversity,
  ): Promise<OrganizationLink> {
    return organizationLinkLoader.load(university.contentfulKey)
  }
}
