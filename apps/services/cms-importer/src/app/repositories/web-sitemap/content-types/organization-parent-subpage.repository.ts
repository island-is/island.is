import { Injectable } from '@nestjs/common'
import { ManagementClientService } from '../../cms/managementClient/managementClient.service'
import type { SitemapUrl, SitemapUrlFetcher } from '../../../web-sitemap/utils'
import { EN_LOCALE, LOCALE } from '../../../constants'
import { getOrganizationPageUrlPrefix } from '@island.is/shared/utils'

@Injectable()
export class OrganizationParentSubpageRepository implements SitemapUrlFetcher {
  constructor(private readonly managementClient: ManagementClientService) {}

  async getSitemapUrls(
    itemsPerPage: number,
    pageIndex: number,
  ): Promise<{
    urls: SitemapUrl[]
    nextPageIndex: number
  }> {
    const parentSubpageResponse = await this.managementClient.getEntries({
      content_type: 'organizationParentSubpage',
      limit: itemsPerPage,
      skip: pageIndex * itemsPerPage,
      select:
        'fields.slug,fields.title,fields.pages,fields.organizationPage,sys',
      'fields.organizationPage.sys.contentType.sys.id': 'organizationPage',
      'fields.pages[exists]': true,
      'sys.publishedAt[exists]': true,
    })
    if (!parentSubpageResponse.ok) throw parentSubpageResponse.error

    const organizationPageIds: string[] = []
    const organizationSubpageIds: string[] = []

    for (const parentSubpage of parentSubpageResponse.data.items) {
      const subpageIds =
        parentSubpage.fields.pages?.[LOCALE]?.map(
          (page: { sys: { id: string } }) => page?.sys?.id,
        ) ?? []
      organizationSubpageIds.push(...subpageIds)
      const orgPageId = parentSubpage.fields.organizationPage?.[LOCALE]?.sys?.id
      if (orgPageId) organizationPageIds.push(orgPageId)
    }

    const organizationSubpageMap = new Map<
      string,
      {
        slug: { [LOCALE]: string; [EN_LOCALE]: string }
        title: { [LOCALE]: string; [EN_LOCALE]: string }
        publishedAt: string | undefined
      }
    >()
    const organizationPageMap = new Map<
      string,
      {
        slug: { [LOCALE]: string; [EN_LOCALE]: string }
        title: { [LOCALE]: string; [EN_LOCALE]: string }
      }
    >()

    while (organizationPageIds.length > 0) {
      const ids = organizationPageIds.splice(0, 10)
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

    while (organizationSubpageIds.length > 0) {
      const ids = organizationSubpageIds.splice(0, 10)
      const organizationSubpageResponse =
        await this.managementClient.getEntries({
          content_type: 'organizationSubpage',
          select: 'fields.slug,fields.title,sys',
          'sys.id[in]': ids.join(','),
          'sys.publishedAt[exists]': true,
        })
      if (!organizationSubpageResponse.ok)
        throw organizationSubpageResponse.error
      for (const organizationSubpage of organizationSubpageResponse.data
        .items) {
        organizationSubpageMap.set(organizationSubpage.sys.id, {
          slug: organizationSubpage.fields.slug,
          title: organizationSubpage.fields.title,
          publishedAt: organizationSubpage.sys.publishedAt,
        })
      }
    }

    const urls: SitemapUrl[] = []

    for (const parentSubpage of parentSubpageResponse.data.items) {
      const organizationPage = organizationPageMap.get(
        parentSubpage.fields.organizationPage?.[LOCALE]?.sys?.id,
      )
      if (!organizationPage) continue

      const organizationPageSlug = organizationPage.slug?.[LOCALE]
      const organizationPageEnSlug = organizationPage.slug?.[EN_LOCALE]
      if (!organizationPageSlug && !organizationPageEnSlug) continue
      const slug = parentSubpage.fields.slug?.[LOCALE]
      const enSlug = parentSubpage.fields.slug?.[EN_LOCALE]
      if (!slug && !enSlug) continue

      for (const subpage of parentSubpage.fields.pages?.[LOCALE] ?? []) {
        const organizationSubpage = organizationSubpageMap.get(subpage.sys.id)
        if (!organizationSubpage) continue
        const organizationSubpageSlug = organizationSubpage.slug?.[LOCALE]
        const organizationSubpageEnSlug = organizationSubpage.slug?.[EN_LOCALE]
        if (!organizationSubpageSlug && !organizationSubpageEnSlug) continue
        urls.push({
          loc: {
            [LOCALE]:
              organizationPageSlug && organizationSubpageSlug && slug
                ? `https://island.is/${getOrganizationPageUrlPrefix(
                    LOCALE,
                  )}/${organizationPageSlug}/${slug}/${organizationSubpageSlug}`
                : '',
            [EN_LOCALE]:
              organizationPageEnSlug && organizationSubpageEnSlug && enSlug
                ? `https://island.is/${getOrganizationPageUrlPrefix(
                    EN_LOCALE,
                  )}/${organizationPageEnSlug}/${enSlug}/${organizationSubpageEnSlug}`
                : '',
          },
          lastmod: organizationSubpage.publishedAt ?? null,
        })
      }
    }

    return {
      urls,
      nextPageIndex:
        parentSubpageResponse.data.total > (pageIndex + 1) * itemsPerPage
          ? pageIndex + 1
          : -1,
    }
  }
}
