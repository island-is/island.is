import { Injectable } from '@nestjs/common'
import type { SitemapUrl, SitemapUrlFetcher } from '../../../web-sitemap/utils'
import { ManagementClientService } from '../../cms/managementClient/managementClient.service'
import { EN_LOCALE, LOCALE } from '../../../constants'

@Injectable()
export class SupportCategoryRepository implements SitemapUrlFetcher {
  constructor(private readonly managementClient: ManagementClientService) {}

  async getSitemapUrls(
    itemsPerPage: number,
    pageIndex: number,
  ): Promise<{ urls: SitemapUrl[]; nextPageIndex: number }> {
    const supportCategoryResponse = await this.managementClient.getEntries({
      content_type: 'supportCategory',
      limit: itemsPerPage,
      skip: pageIndex * itemsPerPage,
      select: 'sys,fields.slug,fields.title,fields.organization',
      'sys.publishedAt[exists]': true,
      'fields.organization.sys.contentType.sys.id': 'organization',
      'fields.organization.fields.serviceWebEnabled': true,
      'fields.organization.sys.publishedAt[exists]': true,
      order: 'fields.organization.sys.id',
    })
    if (!supportCategoryResponse.ok) throw supportCategoryResponse.error

    const organizationMap = new Map<
      string,
      {
        slug: { [LOCALE]: string; [EN_LOCALE]: string }
        title: { [LOCALE]: string; [EN_LOCALE]: string }
      }
    >()

    const urls: SitemapUrl[] = []

    for (const item of supportCategoryResponse.data.items) {
      const organizationId = item.fields.organization?.[LOCALE]?.sys?.id
      if (!organizationId) continue

      if (!organizationMap.has(organizationId)) {
        const organizationResonse = await this.managementClient.getEntry(
          organizationId,
        )
        if (!organizationResonse.ok) throw organizationResonse.error
        organizationMap.set(organizationId, {
          slug: organizationResonse.data.fields.slug,
          title: organizationResonse.data.fields.title,
        })
      }

      const organization = organizationMap.get(organizationId)
      if (!organization) continue

      const slug = item.fields.slug?.[LOCALE]
      const enSlug = item.fields.slug?.[EN_LOCALE]
      if (!slug && !enSlug) continue
      urls.push({
        loc: {
          [LOCALE]:
            organization.slug[LOCALE] && organization.title[LOCALE] && slug
              ? `https://island.is/adstod/${organization.slug[LOCALE]}/${slug}`
              : '',
          [EN_LOCALE]:
            organization.slug[EN_LOCALE] &&
            organization.title[EN_LOCALE] &&
            enSlug
              ? `https://island.is/en/help/${organization.slug[EN_LOCALE]}/${enSlug}`
              : '',
        },
      })
    }

    return {
      urls,
      nextPageIndex:
        supportCategoryResponse.data.total > (pageIndex + 1) * itemsPerPage
          ? pageIndex + 1
          : -1,
    }

    //     for (const item of supportCategoryResponse.data.items) {
    //       const slug = item.fields.slug?.[LOCALE]
    //       const enSlug = item.fields.slug?.[EN_LOCALE]
    //       if (!slug && !enSlug) continue
    //       urls.push({
    //         loc: {
    //           [LOCALE]: slug ? `https://island.is/adstod/${slug}` : '',
    //           [EN_LOCALE]: enSlug ? `https://island.is/en/help/${enSlug}` : '',
    //         },
  }
}
