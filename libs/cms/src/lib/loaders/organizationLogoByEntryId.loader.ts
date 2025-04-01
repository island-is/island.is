import DataLoader from 'dataloader'
import { Injectable } from '@nestjs/common'

import { NestDataLoader } from '@island.is/nest/dataloader'
import { CmsContentfulService } from '../cms.contentful.service'

export type OrganizationLogoByEntryIdDataLoader = DataLoader<
  string,
  string | null,
  string
>

@Injectable()
export class OrganizationLogoByEntryIdLoader
  implements NestDataLoader<string, string | null>
{
  constructor(private readonly cmsContentfulService: CmsContentfulService) {}

  async loadOrganizationLogo(
    organizationKeys: readonly string[],
  ): Promise<Array<string | null>> {
    const organizations = organizationKeys.map((o) =>
      this.cmsContentfulService.getOrganizationByEntryId(o),
    )

    const result = await Promise.all(organizations)

    return result.map((r) => r?.logo?.url ?? null)
  }

  generateDataLoader(): OrganizationLogoByEntryIdDataLoader {
    return new DataLoader((keys) => this.loadOrganizationLogo(keys))
  }
}
