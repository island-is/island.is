import DataLoader from 'dataloader'
import { Injectable } from '@nestjs/common'

import { NestDataLoader } from '@island.is/nest/dataloader'
import { CmsContentfulService } from '../cms.contentful.service'
import { ShortTitle } from './organizationTitleByKey.loader'

export type OrganizationZendeskInstanceByNationalIdDataLoader = DataLoader<
  string,
  ShortTitle,
  string
>
@Injectable()
export class OrganizationZendeskInstanceByNationalIdLoader
  implements NestDataLoader<string, ShortTitle>
{
  constructor(private readonly cmsContentfulService: CmsContentfulService) {}

  async loadOrganizationZendeskInstance(
    organizationKeys: readonly string[],
  ): Promise<Array<ShortTitle>> {
    const organizationTitles =
      await this.cmsContentfulService.getOrganizationZendeskInstance(
        organizationKeys as string[],
        'kennitala',
        'is',
      )

    return organizationTitles
  }

  generateDataLoader(): OrganizationZendeskInstanceByNationalIdDataLoader {
    return new DataLoader((keys) => this.loadOrganizationZendeskInstance(keys))
  }
}
