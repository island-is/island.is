import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { UniversityGatewayApi } from '../universityGateway.service'
import {
  UniversityGatewayGetPogramInput,
  UniversityGatewayProgramsPaginated,
} from './dto'
import {
  UniversityGatewayProgramDetails,
  UniversityGatewayProgramFilter,
  UniversityGatewayUniversity,
} from './models'
import { Loader } from '@island.is/nest/dataloader'
import {
  LogoUrl,
  OrganizationLogoDataLoader,
  OrganizationLogoLoader,
  OrganizationShortTitleDataLoader,
  OrganizationShortTitleLoader,
  ShortTitle,
} from '@island.is/cms'

@Resolver()
export class MainResolver {
  constructor(private readonly universityGatewayApi: UniversityGatewayApi) {}

  @Query(() => UniversityGatewayProgramsPaginated)
  universityGatewayPrograms() {
    return this.universityGatewayApi.getActivePrograms()
  }

  @Query(() => UniversityGatewayProgramDetails)
  universityGatewayProgram(
    @Args('input') input: UniversityGatewayGetPogramInput,
  ) {
    return this.universityGatewayApi.getProgramById(input)
  }

  @Query(() => [UniversityGatewayUniversity])
  universityGatewayUniversities() {
    return this.universityGatewayApi.getUniversities()
  }

  @ResolveField('contentfulLogoUrl', () => String, { nullable: true })
  async resolveContentfulLogoUrl(
    @Loader(OrganizationLogoLoader)
    organizationLogoLoader: OrganizationLogoDataLoader,
    @Parent() university: UniversityGatewayUniversity,
  ): Promise<LogoUrl> {
    return organizationLogoLoader.load(university.contentfulKey)
  }

  @ResolveField('contentfulTitle', () => String, { nullable: true })
  async resolveContentfulTitle(
    @Loader(OrganizationShortTitleLoader)
    organizationTitleLoader: OrganizationShortTitleDataLoader,
    @Parent() university: UniversityGatewayUniversity,
  ): Promise<ShortTitle> {
    return organizationTitleLoader.load(university.contentfulKey)
  }

  @Query(() => [UniversityGatewayProgramFilter])
  universityGatewayProgramFilters() {
    return this.universityGatewayApi.getProgramFilters()
  }
}
