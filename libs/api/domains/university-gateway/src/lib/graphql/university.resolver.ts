import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { Loader } from '@island.is/nest/dataloader'
import { CacheControl, CacheControlOptions } from '@island.is/nest/graphql'
import { CACHE_CONTROL_MAX_AGE } from '@island.is/shared/constants'
import {
  OrganizationLinkByReferenceIdLoader,
  OrganizationLogoByReferenceIdLoader,
  OrganizationTitleByReferenceIdLoader,
} from '@island.is/cms'
import type {
  LogoUrl,
  OrganizationLink,
  OrganizationLinkByReferenceIdDataLoader,
  OrganizationLogoByReferenceIdDataLoader,
  OrganizationTitleByReferenceIdDataLoader,
  ShortTitle,
} from '@island.is/cms'
import { UniversityGatewayApi } from '../universityGateway.service'
import { UniversityGatewayUniversity } from './models'
import { UNIVERSITY_GATEWAY_CACHE_CONTROL_MAX_AGE } from '../cacheControl'

const defaultCache: CacheControlOptions = { maxAge: UNIVERSITY_GATEWAY_CACHE_CONTROL_MAX_AGE }

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
    @Loader(OrganizationLogoByReferenceIdLoader)
    organizationLogoLoader: OrganizationLogoByReferenceIdDataLoader,
    @Parent() university: UniversityGatewayUniversity,
  ): Promise<LogoUrl> {
    return await organizationLogoLoader.load(university.contentfulKey)
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
