import DataLoader from 'dataloader'
import { Injectable } from '@nestjs/common'

import { NestDataLoader } from '@island.is/nest/dataloader'
import { CmsContentfulService } from '../cms.contentful.service'
import { IOrganizationFields } from '../generated/contentfulTypes'

export type LogoUrl = string | null

interface OrganizationLogoLoadInput {
  field: keyof IOrganizationFields
  key: string
}

export type OrganizationLogoDataLoader = DataLoader<
  OrganizationLogoLoadInput,
  LogoUrl,
  string
>

@Injectable()
export class OrganizationLogoLoader
  implements NestDataLoader<OrganizationLogoLoadInput, LogoUrl>
{
  constructor(private readonly cmsContentfulService: CmsContentfulService) {}

  async loadOrganizationLogos(
    keys: readonly OrganizationLogoLoadInput[],
  ): Promise<Array<LogoUrl>> {
    const organizationLogos = await Promise.all(
      keys.map(({ field, key }) =>
        this.cmsContentfulService.getOrganizationLogos([key], field),
      ),
    )

    return organizationLogos.flat()
  }

  generateDataLoader(): OrganizationLogoDataLoader {
    return new DataLoader((keys) => this.loadOrganizationLogos(keys))
  }
}
