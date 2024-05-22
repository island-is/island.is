import DataLoader from 'dataloader'
import { Injectable } from '@nestjs/common'

import { NestDataLoader } from '@island.is/nest/dataloader'
import { CmsContentfulService } from '../cms.contentful.service'
import {
  OrganizationLink,
  OrganizationLinkByReferenceIdDataLoader,
} from './organizationLinkByKey.loader'

@Injectable()
export class OrganizationLinkEnByReferenceIdLoader
  implements NestDataLoader<string, OrganizationLink>
{
  constructor(private readonly cmsContentfulService: CmsContentfulService) {}

  async loadOrganizationLink(
    organizationKeys: readonly string[],
  ): Promise<Array<OrganizationLink>> {
    const OrganizationLinks =
      await this.cmsContentfulService.getOrganizationLink(
        organizationKeys as string[],
        'en',
      )

    return OrganizationLinks
  }

  generateDataLoader(): OrganizationLinkByReferenceIdDataLoader {
    return new DataLoader((keys) => this.loadOrganizationLink(keys))
  }
}
