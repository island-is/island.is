import DataLoader from 'dataloader'
import { Injectable } from '@nestjs/common'

import { NestDataLoader } from '@island.is/nest/dataloader'
import { CmsContentfulService } from '../cms.contentful.service'

export type OrganizationLink = string | null

export type OrganizationLinkByReferenceIdDataLoader = DataLoader<
  string,
  OrganizationLink,
  string
>

@Injectable()
export class OrganizationLinkByReferenceIdLoader
  implements NestDataLoader<string, OrganizationLink>
{
  constructor(private readonly cmsContentfulService: CmsContentfulService) {}

  async loadOrganizationLink(
    organizationKeys: readonly string[],
  ): Promise<Array<OrganizationLink>> {
    const OrganizationLinks =
      await this.cmsContentfulService.getOrganizationLink(
        organizationKeys as string[],
      )

    return OrganizationLinks
  }

  generateDataLoader(): OrganizationLinkByReferenceIdDataLoader {
    return new DataLoader((keys) => this.loadOrganizationLink(keys))
  }
}
