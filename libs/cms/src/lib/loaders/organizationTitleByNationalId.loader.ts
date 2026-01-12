import DataLoader from 'dataloader'
import { Injectable } from '@nestjs/common'

import { NestDataLoader } from '@island.is/nest/dataloader'
import { CmsContentfulService } from '../cms.contentful.service'
import { ShortTitle } from './organizationTitleByKey.loader'

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
    organizationKeys: readonly string[],
  ): Promise<Array<ShortTitle>> {
    const organizationTitles =
      await this.cmsContentfulService.getOrganizationTitles(
        organizationKeys as string[],
        'kennitala',
        'is',
      )

    return organizationTitles
  }

  generateDataLoader(): OrganizationTitleByNationalIdDataLoader {
    return new DataLoader((keys) => this.loadOrganizationTitle(keys))
  }
}
