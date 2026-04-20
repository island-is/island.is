import { Injectable } from '@nestjs/common'
import type { SitemapUrl, SitemapUrlFetcher } from '../../../web-sitemap/utils'
import { ManagementClientService } from '../../cms/managementClient/managementClient.service'
import { EN_LOCALE, LOCALE } from '../../../constants'
import { getOrganizationPageUrlPrefix } from '@island.is/shared/utils'

@Injectable()
export class OrganizationNewsRepository implements SitemapUrlFetcher {
  constructor(private readonly managementClient: ManagementClientService) {}

  async getSitemapUrls(
    itemsPerPage: number,
    pageIndex: number,
  ): Promise<{ urls: SitemapUrl[]; nextPageIndex: number }> {
    const newsResponse = await this.managementClient.getEntries({
      content_type: 'news',
      limit: itemsPerPage,
      skip: pageIndex * itemsPerPage,
      select: 'sys,fields.slug,fields.title,fields.organization',
      'sys.publishedAt[exists]': true,
      order: 'fields.organization.sys.id',
    })
    if (!newsResponse.ok) throw newsResponse.error

    const organizationIds: Set<string> = new Set()
    for (const item of newsResponse.data.items) {
      const organizationId = item.fields.organization?.[LOCALE]?.sys?.id
      if (organizationId) organizationIds.add(organizationId)
    }

    const organizationPageMap = new Map<
      string,
      {
        slug: { [LOCALE]: string; [EN_LOCALE]: string }
        title: { [LOCALE]: string; [EN_LOCALE]: string }
      }
    >()

    for (const id of organizationIds) {
      const organizationPageResponse = await this.managementClient.getEntries({
        content_type: 'organizationPage',
        links_to_entry: id,
        select: 'fields.slug,fields.title',
        limit: 1,
        'sys.publishedAt[exists]': true,
      })
      if (!organizationPageResponse.ok) throw organizationPageResponse.error
      if (organizationPageResponse.data.items.length === 0) continue
      organizationPageMap.set(id, {
        slug: organizationPageResponse.data.items[0].fields.slug,
        title: organizationPageResponse.data.items[0].fields.title,
      })
    }
    const urls: SitemapUrl[] = newsResponse.data.items
      .map((item) => {
        const organizationPage = organizationPageMap.get(
          item.fields.organization?.[LOCALE]?.sys?.id,
        )
        if (!organizationPage) return null
        const slug = item.fields.slug?.[LOCALE]
        const enSlug = item.fields.slug?.[EN_LOCALE]
        if (!slug && !enSlug) return null
        return {
          loc: {
            [LOCALE]:
              slug &&
              organizationPage.slug?.[LOCALE] &&
              item.fields.title?.[LOCALE]
                ? `https://island.is/${getOrganizationPageUrlPrefix(LOCALE)}/${
                    organizationPage.slug[LOCALE]
                  }/frett/${slug}`
                : '',
            [EN_LOCALE]:
              enSlug &&
              organizationPage.slug?.[EN_LOCALE] &&
              item.fields.title?.[EN_LOCALE]
                ? `https://island.is/${getOrganizationPageUrlPrefix(
                    EN_LOCALE,
                  )}/${organizationPage.slug[EN_LOCALE]}/news/${enSlug}`
                : '',
          },
          lastmod: item.sys.publishedAt,
        }
      })
      .filter((url) => url !== null)

    return {
      urls,
      nextPageIndex:
        newsResponse.data.total > (pageIndex + 1) * itemsPerPage
          ? pageIndex + 1
          : -1,
    }
  }
}
