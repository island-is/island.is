import { Injectable } from '@nestjs/common'
import { ManagementClientService } from '../../cms/managementClient/managementClient.service'
import type { SitemapUrl, SitemapUrlFetcher } from '../../../web-sitemap/utils'
import { EN_LOCALE, LOCALE } from '../../../constants'
import { getOrganizationPageUrlPrefix } from '@island.is/shared/utils'

@Injectable()
export class OrganizationPageRepository implements SitemapUrlFetcher {
  constructor(private readonly managementClient: ManagementClientService) {}

  async getSitemapUrls(
    itemsPerPage: number,
    pageIndex: number,
  ): Promise<{
    urls: SitemapUrl[]
    nextPageIndex: number
  }> {
    const organizationPageResponse = await this.managementClient.getEntries({
      content_type: 'organizationPage',
      limit: itemsPerPage,
      skip: pageIndex * itemsPerPage,
      select: 'fields.slug,fields.title,sys',
      'sys.publishedAt[exists]': true,
    })
    if (!organizationPageResponse.ok) throw organizationPageResponse.error

    const urls = organizationPageResponse.data.items.map((item) => ({
      loc: {
        [LOCALE]:
          item.fields.title?.[LOCALE] && item.fields.slug?.[LOCALE]
            ? `https://island.is/${getOrganizationPageUrlPrefix(LOCALE)}/${
                item.fields.slug[LOCALE]
              }`
            : '',
        [EN_LOCALE]:
          item.fields.title?.[EN_LOCALE] && item.fields.slug?.[EN_LOCALE]
            ? `https://island.is/${getOrganizationPageUrlPrefix(EN_LOCALE)}/${
                item.fields.slug[EN_LOCALE]
              }`
            : '',
      },
      lastmod: item.sys.publishedAt ?? null,
    }))

    return {
      urls,
      nextPageIndex:
        organizationPageResponse.data.total > (pageIndex + 1) * itemsPerPage
          ? pageIndex + 1
          : -1,
    }
  }
}
