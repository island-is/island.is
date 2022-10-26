import DataLoader from 'dataloader'
import { Injectable } from '@nestjs/common'

import { NestDataLoader } from '@island.is/nest/dataloader'
import { CmsContentfulService } from '../cms.contentful.service'

export type LogoUrl = string | null

export type OrganizationLogoDataLoader = DataLoader<string, LogoUrl, string>

@Injectable()
export class OrganizationLogoLoader implements NestDataLoader<string, LogoUrl> {
  constructor(private readonly cmsContentfulService: CmsContentfulService) {}

  async loadOrganizationLogo(
    organizationTitles: readonly string[],
  ): Promise<Array<LogoUrl>> {
    const organizationLogos = await this.cmsContentfulService.getOrganizationLogos(
      organizationTitles.map((title) => title),
    )

    return organizationLogos
  }

  generateDataLoader(): OrganizationLogoDataLoader {
    return new DataLoader(this.loadOrganizationLogo.bind(this))
  }
}
