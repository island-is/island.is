import DataLoader from 'dataloader'
import { Injectable } from '@nestjs/common'

import { NestDataLoader } from '@island.is/nest/dataloader'
import { CmsContentfulService } from '../cms.contentful.service'

export type ShortTitle = string | null

export type OrganizationShortTitleDataLoader = DataLoader<
  string,
  ShortTitle,
  string
>

@Injectable()
export class OrganizationShortTitleLoader
  implements NestDataLoader<string, ShortTitle>
{
  constructor(private readonly cmsContentfulService: CmsContentfulService) {}

  async loadOrganizationShortTitle(
    organizationTitles: readonly string[],
  ): Promise<Array<ShortTitle>> {
    const organizationShortTitles =
      await this.cmsContentfulService.getOrganizationStortTitles(
        organizationTitles as string[],
      )

    return organizationShortTitles
  }

  generateDataLoader(): OrganizationShortTitleDataLoader {
    return new DataLoader((keys) => this.loadOrganizationShortTitle(keys))
  }
}
