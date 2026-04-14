import { Injectable } from '@nestjs/common'
import { ManagementClientService } from '../../cms/managementClient/managementClient.service'
import type { SitemapUrl, SitemapUrlFetcher } from '../../../web-sitemap/utils'
import { EN_LOCALE, LOCALE } from '../../../constants'
import { getOrganizationPageUrlPrefix } from '@island.is/shared/utils'

@Injectable()
export class OrganizationSubpageRepository implements SitemapUrlFetcher {
  constructor(private readonly managementClient: ManagementClientService) {}

  async getSitemapUrls(
    itemsPerPage: number,
    pageIndex: number,
  ): Promise<{
    urls: SitemapUrl[]
    nextPageIndex: number
  }> {
    const subpageResponse = await this.managementClient.getEntries({
      content_type: 'organizationSubpage',
      limit: itemsPerPage,
      skip: pageIndex * itemsPerPage,
      select: 'fields.slug,fields.title,fields.organizationPage,sys',
      'fields.organizationPage.sys.contentType.sys.id': 'organizationPage',
      'fields.organizationParentSubpage[exists]': false,
      'sys.publishedAt[exists]': true,
    })
    if (!subpageResponse.ok) throw subpageResponse.error

    const organizationPageIds: string[] = []

    for (const subpage of subpageResponse.data.items) {
      const id = subpage.fields.organizationPage?.[LOCALE]?.sys?.id
      if (id) organizationPageIds.push(id)
    }

    const organizationPageMap = new Map<
      string,
      {
        slug: { [LOCALE]: string; [EN_LOCALE]: string }
        title: { [LOCALE]: string; [EN_LOCALE]: string }
      }
    >()

    while (organizationPageIds.length > 0) {
      const ids = organizationPageIds.splice(0, 15)
      const organizationPageResponse = await this.managementClient.getEntries({
        content_type: 'organizationPage',
        select: 'fields.slug,fields.title,sys',
        'sys.id[in]': ids.join(','),
        'sys.publishedAt[exists]': true,
      })
      if (!organizationPageResponse.ok) throw organizationPageResponse.error
      for (const organizationPage of organizationPageResponse.data.items) {
        organizationPageMap.set(organizationPage.sys.id, {
          slug: organizationPage.fields.slug,
          title: organizationPage.fields.title,
        })
      }
    }

    const urls: SitemapUrl[] = []

    for (const subpage of subpageResponse.data.items) {
      const organizationPage = organizationPageMap.get(
        subpage.fields.organizationPage?.[LOCALE]?.sys?.id,
      )
      if (!organizationPage) continue
      const slug = subpage.fields.slug?.[LOCALE]
      const enSlug = subpage.fields.slug?.[EN_LOCALE]
      if (!slug && !enSlug) continue
      const url =
        slug &&
        organizationPage.slug?.[LOCALE] &&
        subpage.fields.title?.[LOCALE]
          ? `https://island.is/${getOrganizationPageUrlPrefix(LOCALE)}/${
              organizationPage.slug[LOCALE]
            }/${slug}`
          : ''
      const enUrl =
        enSlug &&
        organizationPage.slug?.[EN_LOCALE] &&
        subpage.fields.title?.[EN_LOCALE]
          ? `https://island.is/${getOrganizationPageUrlPrefix(EN_LOCALE)}/${
              organizationPage.slug[EN_LOCALE]
            }/${enSlug}`
          : ''
      urls.push({
        loc: {
          [LOCALE]: url,
          [EN_LOCALE]: enUrl,
        },
        lastmod: subpage.sys.publishedAt ?? null,
      })
    }

    return {
      urls,
      nextPageIndex:
        subpageResponse.data.total > (pageIndex + 1) * itemsPerPage
          ? pageIndex + 1
          : -1,
    }
  }
}
