import DataLoader from 'dataloader'
import { Injectable } from '@nestjs/common'

import { NestDataLoader } from '@island.is/nest/dataloader'
import { CmsContentfulService } from '../cms.contentful.service'
import type { LogoUrl } from '../utils/types'

export type OrganizationLogoByNationalIdDataLoader = DataLoader<
  string,
  LogoUrl,
  string
>

@Injectable()
export class OrganizationLogoByNationalIdLoader
  implements NestDataLoader<string, LogoUrl>
{
  constructor(private readonly cmsContentfulService: CmsContentfulService) {}

  async loadOrganizationLogo(
    organizationTitles: readonly string[],
  ): Promise<Array<LogoUrl>> {
    const organizationLogos =
      await this.cmsContentfulService.getOrganizationLogos(
        organizationTitles as string[],
        'kennitala',
      )

    return organizationLogos
  }

  generateDataLoader(): OrganizationLogoByNationalIdDataLoader {
    return new DataLoader((keys) => this.loadOrganizationLogo(keys))
  }
}
