import { Injectable } from '@nestjs/common'
import type { SitemapUrl, SitemapUrlFetcher } from '../../../web-sitemap/utils'
import { ManagementClientService } from '../../cms/managementClient/managementClient.service'
import { EN_LOCALE, LOCALE } from '../../../constants'

@Injectable()
export class ServiceWebRepository implements SitemapUrlFetcher {
  constructor(private readonly managementClient: ManagementClientService) {}

  async getSitemapUrls(
    itemsPerPage: number,
    pageIndex: number,
  ): Promise<{ urls: SitemapUrl[]; nextPageIndex: number }> {
    const serviceWebResponse = await this.managementClient.getEntries({
      content_type: 'organization',
      'fields.serviceWebEnabled': true,
      'sys.publishedAt[exists]': true,
      select: 'fields.slug,fields.title',
      limit: itemsPerPage,
      skip: pageIndex * itemsPerPage,
    })
    if (!serviceWebResponse.ok) throw serviceWebResponse.error

    const urls: SitemapUrl[] = []

    for (const item of serviceWebResponse.data.items) {
      const slug = item.fields.slug?.[LOCALE]
      const enSlug = item.fields.slug?.[EN_LOCALE]
      if (!slug && !enSlug) continue
      urls.push({
        loc: {
          [LOCALE]: slug ? `https://island.is/adstod/${slug}` : '',
          [EN_LOCALE]: enSlug ? `https://island.is/en/help/${enSlug}` : '',
        },
      })
      urls.push({
        loc: {
          [LOCALE]: slug ? `https://island.is/adstod/${slug}/hafa-samband` : '',
          [EN_LOCALE]: enSlug
            ? `https://island.is/en/help/${enSlug}/contact-us`
            : '',
        },
      })
    }

    return {
      urls,
      nextPageIndex:
        serviceWebResponse.data.total > (pageIndex + 1) * itemsPerPage
          ? pageIndex + 1
          : -1,
    }
  }
}
