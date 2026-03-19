import { Injectable } from '@nestjs/common'
import { ManagementClientService } from '../../cms/managementClient/managementClient.service'
import type { SitemapUrl, SitemapUrlFetcher } from '../../../web-sitemap/utils'
import { EN_LOCALE, LOCALE } from '../../../constants'

@Injectable()
export class FrontpageRepository implements SitemapUrlFetcher {
  constructor(private readonly managementClient: ManagementClientService) {}

  async getSitemapUrls(): Promise<{
    urls: SitemapUrl[]
    nextPageIndex: number
  }> {
    const frontpageResponse = await this.managementClient.getEntries({
      content_type: 'frontpage',
      limit: 1,
      select: 'sys',
      'sys.publishedAt[exists]': true,
    })
    if (!frontpageResponse.ok) throw frontpageResponse.error

    return {
      urls: [
        {
          loc: {
            [LOCALE]: 'https://island.is',
            [EN_LOCALE]: 'https://island.is/en',
          },
          lastmod: frontpageResponse.data.items[0]?.sys?.publishedAt,
        },
      ],
      nextPageIndex: -1,
    }
  }
}
