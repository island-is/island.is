import DataLoader from 'dataloader'
import { Injectable } from '@nestjs/common'

import { NestDataLoader } from '@island.is/nest/dataloader'
import { CmsContentfulService } from '../cms.contentful.service'

export type ShortTitle = string | null

export type OrganizationTitleDataLoader = DataLoader<string, ShortTitle, string>

@Injectable()
export class OrganizationTitleLoader
  implements NestDataLoader<string, ShortTitle>
{
  constructor(private readonly cmsContentfulService: CmsContentfulService) {}

  async loadOrganizationTitle(
    organizationKeys: readonly string[],
  ): Promise<Array<ShortTitle>> {
    const organizationTitles =
      await this.cmsContentfulService.getOrganizationTitles(
        organizationKeys as string[],
      )

    return organizationTitles
  }

  generateDataLoader(): OrganizationTitleDataLoader {
    return new DataLoader((keys) => this.loadOrganizationTitle(keys))
  }
}
