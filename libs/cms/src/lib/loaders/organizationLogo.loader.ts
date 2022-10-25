import DataLoader from 'dataloader'
import { Injectable } from '@nestjs/common'

import { NestDataLoader } from '@island.is/nest/dataloader'
import { CmsContentfulService } from '../cms.contentful.service'
import { OrganizationLogoInput } from '../dto/getOrganizationsLogo.input'

export type LogoUrl = string | null

export type OrganizationLogoDataLoader = DataLoader<
  OrganizationLogoInput,
  LogoUrl,
  string
>

@Injectable()
export class OrganizationLogoLoader
  implements NestDataLoader<OrganizationLogoInput, LogoUrl> {
  constructor(private readonly cmsContentfulService: CmsContentfulService) {}

  async loadOrganizationLogo(
    inputs: readonly OrganizationLogoInput[],
  ): Promise<Array<LogoUrl>> {
    // Only support one language at a time.
    const lang = inputs[0].lang
    const organizationTitles = inputs.map(
      ({ organizationTitle }) => organizationTitle,
    )

    const organizationLogos = await this.cmsContentfulService.getOrganizationsLogo(
      { organizationTitles, lang },
    )

    return organizationLogos
  }

  generateDataLoader(): OrganizationLogoDataLoader {
    return new DataLoader(this.loadOrganizationLogo.bind(this))
  }
}
