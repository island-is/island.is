import { Injectable } from '@nestjs/common'
import type { SitemapUrl, SitemapUrlFetcher } from '../../../web-sitemap/utils'
import { ManagementClientService } from '../../cms/managementClient/managementClient.service'
import { EN_LOCALE, LOCALE } from '../../../constants'

const FRONTPAGE_NEWS_TAG_ID = '52DSBcobJGSiwZ6o9zkiT0'

@Injectable()
export class FrontpageNewsRepository implements SitemapUrlFetcher {
  constructor(private readonly managementClient: ManagementClientService) {}

  async getSitemapUrls(
    itemsPerPage: number,
    pageIndex: number,
  ): Promise<{ urls: SitemapUrl[]; nextPageIndex: number }> {
    const newsResponse = await this.managementClient.getEntries({
      content_type: 'news',
      limit: itemsPerPage,
      skip: pageIndex * itemsPerPage,
      select: 'sys,fields.slug,fields.title',
      'sys.publishedAt[exists]': true,
      'fields.genericTags.sys.id[in]': FRONTPAGE_NEWS_TAG_ID,
    })
    if (!newsResponse.ok) throw newsResponse.error

    const urls: SitemapUrl[] = newsResponse.data.items.map((item) => {
      return {
        loc: {
          [LOCALE]:
            item.fields.slug?.[LOCALE] && item.fields.title?.[LOCALE]
              ? `https://island.is/frett/${item.fields.slug[LOCALE]}`
              : '',
          [EN_LOCALE]:
            item.fields.slug?.[EN_LOCALE] && item.fields.title?.[EN_LOCALE]
              ? `https://island.is/en/news/${item.fields.slug[EN_LOCALE]}`
              : '',
        },
        lastmod: item.sys.publishedAt,
      }
    })

    return {
      urls,
      nextPageIndex:
        newsResponse.data.total > (pageIndex + 1) * itemsPerPage
          ? pageIndex + 1
          : -1,
    }
  }
}
