import { Injectable } from '@nestjs/common'
import { getProjectPageUrlPrefix } from '@island.is/shared/utils'
import type { SitemapUrl, SitemapUrlFetcher } from '../../../web-sitemap/utils'
import { ManagementClientService } from '../../cms/managementClient/managementClient.service'
import { EN_LOCALE, LOCALE } from '../../../constants'

@Injectable()
export class ProjectPageRepository implements SitemapUrlFetcher {
  constructor(private readonly managementClient: ManagementClientService) {}

  async getSitemapUrls(
    itemsPerPage: number,
    pageIndex: number,
  ): Promise<{ urls: SitemapUrl[]; nextPageIndex: number }> {
    const projectPageResponse = await this.managementClient.getEntries({
      content_type: 'projectPage',
      limit: itemsPerPage,
      skip: pageIndex * itemsPerPage,
      select: 'fields.slug,fields.title,sys,fields.projectSubpages',
      'sys.publishedAt[exists]': true,
    })
    if (!projectPageResponse.ok) throw projectPageResponse.error

    const projectSubpageIds: string[] = []
    for (const projectPage of projectPageResponse.data.items)
      for (const subpage of projectPage.fields.projectSubpages?.[LOCALE] ?? [])
        projectSubpageIds.push(subpage.sys.id)

    const projectSubpageMap = new Map<
      string,
      {
        slug: { [LOCALE]: string; [EN_LOCALE]: string }
        title: { [LOCALE]: string; [EN_LOCALE]: string }
        publishedAt: string | undefined
      }
    >()

    while (projectSubpageIds.length > 0) {
      const ids = projectSubpageIds.splice(0, 10)
      const projectSubpageResponse = await this.managementClient.getEntries({
        content_type: 'projectSubpage',
        select: 'fields.slug,fields.title,sys',
        'sys.id[in]': ids.join(','),
        'sys.publishedAt[exists]': true,
      })
      if (!projectSubpageResponse.ok) throw projectSubpageResponse.error
      for (const projectSubpage of projectSubpageResponse.data.items)
        projectSubpageMap.set(projectSubpage.sys.id, {
          slug: projectSubpage.fields.slug,
          title: projectSubpage.fields.title,
          publishedAt: projectSubpage.sys.publishedAt,
        })
    }

    const urls: SitemapUrl[] = []

    for (const projectPage of projectPageResponse.data.items) {
      const slug = projectPage.fields.slug?.[LOCALE]
      const enSlug = projectPage.fields.slug?.[EN_LOCALE]
      if (!slug && !enSlug) continue
      urls.push({
        loc: {
          [LOCALE]:
            slug && projectPage.fields.title?.[LOCALE]
              ? `https://island.is/${getProjectPageUrlPrefix(LOCALE)}/${slug}`
              : '',
          [EN_LOCALE]:
            enSlug && projectPage.fields.title?.[EN_LOCALE]
              ? `https://island.is/${getProjectPageUrlPrefix(
                  EN_LOCALE,
                )}/${enSlug}`
              : '',
        },
        lastmod: projectPage.sys.publishedAt ?? null,
      })

      for (const subpage of projectPage.fields.projectSubpages?.[LOCALE] ??
        []) {
        const projectSubpage = projectSubpageMap.get(subpage.sys.id)
        if (!projectSubpage) continue
        const subpageSlug = projectSubpage.slug?.[LOCALE]
        const subpageEnSlug = projectSubpage.slug?.[EN_LOCALE]
        if (!subpageSlug && !subpageEnSlug) continue
        urls.push({
          loc: {
            [LOCALE]:
              slug && subpageSlug && projectSubpage.title?.[LOCALE]
                ? `https://island.is/${getProjectPageUrlPrefix(
                    LOCALE,
                  )}/${slug}/${subpageSlug}`
                : '',
            [EN_LOCALE]:
              enSlug && subpageEnSlug && projectSubpage.title?.[EN_LOCALE]
                ? `https://island.is/${getProjectPageUrlPrefix(
                    EN_LOCALE,
                  )}/${enSlug}/${subpageEnSlug}`
                : '',
          },
          lastmod: projectSubpage.publishedAt ?? null,
        })
      }
    }

    return {
      urls,
      nextPageIndex:
        projectPageResponse.data.total > (pageIndex + 1) * itemsPerPage
          ? pageIndex + 1
          : -1,
    }
  }
}
