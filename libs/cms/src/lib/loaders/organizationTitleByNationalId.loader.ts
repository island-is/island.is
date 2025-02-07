import DataLoader from 'dataloader'
import { Injectable } from '@nestjs/common'

import { NestDataLoader } from '@island.is/nest/dataloader'
import { CmsContentfulService } from '../cms.contentful.service'

export type ShortTitle = string | null

export type OrganizationTitleByNationalIdDataLoader = DataLoader<
  string,
  ShortTitle,
  string
>

@Injectable()
export class OrganizationTitleByNationalIdLoader
  implements NestDataLoader<string, ShortTitle>
{
  constructor(private readonly cmsContentfulService: CmsContentfulService) {}

  async loadOrganizationTitle(
    organizationNationalIds: readonly string[],
  ): Promise<Array<ShortTitle>> {
    const organizationTitles =
      await this.cmsContentfulService.getOrganizationTitlesByNationalIds(
        organizationNationalIds as string[],
        'is',
      )

    return organizationTitles
  }

  generateDataLoader(): OrganizationTitleByNationalIdDataLoader {
    return new DataLoader((nationalIds) =>
      this.loadOrganizationTitle(nationalIds),
    )
  }
}
