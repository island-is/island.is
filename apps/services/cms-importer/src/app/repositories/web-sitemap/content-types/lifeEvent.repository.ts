import { Injectable } from '@nestjs/common'
import { EN_LOCALE, LOCALE } from '../../../constants'
import { SitemapUrl, SitemapUrlFetcher } from '../../../web-sitemap/utils'
import { ManagementClientService } from '../../cms/managementClient/managementClient.service'

@Injectable()
export class LifeEventRepository implements SitemapUrlFetcher {
  constructor(private readonly managementClient: ManagementClientService) {}

  async getSitemapUrls(
    itemsPerPage: number,
    pageIndex: number,
  ): Promise<{ urls: SitemapUrl[]; nextPageIndex: number }> {
    const lifeEventsResponse = await this.managementClient.getEntries({
      content_type: 'lifeEventPage',
      limit: itemsPerPage,
      skip: pageIndex * itemsPerPage,
      select: 'sys,fields.slug,fields.title',
      'fields.slug[exists]': true,
      'fields.category[exists]': true,
    })
    if (!lifeEventsResponse.ok) throw lifeEventsResponse.error

    const urls: SitemapUrl[] = lifeEventsResponse.data.items.map((item) => ({
      loc: {
        [LOCALE]:
          item.fields.slug?.[LOCALE] && item.fields.title?.[LOCALE]
            ? `https://island.is/lifsvidburdir/${item.fields.slug[LOCALE]}`
            : '',
        [EN_LOCALE]:
          item.fields.slug?.[EN_LOCALE] && item.fields.title?.[EN_LOCALE]
            ? `https://island.is/en/life-events/${item.fields.slug[EN_LOCALE]}`
            : '',
      },
      lastmod: item.sys.publishedAt,
    }))

    return {
      urls,
      nextPageIndex:
        lifeEventsResponse.data.total > (pageIndex + 1) * itemsPerPage
          ? pageIndex + 1
          : -1,
    }
  }
}
