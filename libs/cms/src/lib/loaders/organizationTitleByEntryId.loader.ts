import DataLoader from 'dataloader'
import { Injectable } from '@nestjs/common'

import { NestDataLoader } from '@island.is/nest/dataloader'
import { CmsContentfulService } from '../cms.contentful.service'

export type OrganizationTitleByEntryIdDataLoader = DataLoader<
  string,
  string | null,
  string
>

@Injectable()
export class OrganizationTitleByEntryIdLoader
  implements NestDataLoader<string, string | null>
{
  constructor(private readonly cmsContentfulService: CmsContentfulService) {}

  async loadOrganizationTitle(
    organizationKeys: readonly string[],
  ): Promise<Array<string | null>> {
    const organizations = organizationKeys.map((o) =>
      this.cmsContentfulService.getOrganizationByEntryId(o),
    )

    const result = await Promise.all(organizations)

    return result.map((r) => r?.title ?? null)
  }

  generateDataLoader(): OrganizationTitleByEntryIdDataLoader {
    return new DataLoader((keys) => this.loadOrganizationTitle(keys))
  }
}
