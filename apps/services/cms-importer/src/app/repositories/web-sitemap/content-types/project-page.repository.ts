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
      select: 'fields.slug,fields.title,sys',
      'sys.publishedAt[exists]': true,
    })
    if (!projectPageResponse.ok) throw projectPageResponse.error

    const projectPageIds: string[] = projectPageResponse.data.items.map(
      (projectPage) => projectPage.sys.id,
    )

    const projectSubpagesByProjectPageId = new Map<
      string,
      {
        slug: { [LOCALE]: string; [EN_LOCALE]: string }
        title: { [LOCALE]: string; [EN_LOCALE]: string }
        publishedAt: string | undefined
      }[]
    >()

    while (projectPageIds.length > 0) {
      const ids = projectPageIds.splice(0, 15)
      const projectSubpageResponse = await this.managementClient.getEntries({
        content_type: 'projectSubpage',
        select: 'fields.slug,fields.title,fields.projectPage,sys',
        'fields.projectPage.sys.id[in]': ids.join(','),
        'sys.publishedAt[exists]': true,
      })
      if (!projectSubpageResponse.ok) throw projectSubpageResponse.error
      for (const projectSubpage of projectSubpageResponse.data.items) {
        const projectPageId =
          projectSubpage.fields.projectPage?.[LOCALE]?.sys?.id
        if (!projectPageId) continue
        const subpages = projectSubpagesByProjectPageId.get(projectPageId) ?? []
        subpages.push({
          slug: projectSubpage.fields.slug,
          title: projectSubpage.fields.title,
          publishedAt: projectSubpage.sys.publishedAt,
        })
        projectSubpagesByProjectPageId.set(projectPageId, subpages)
      }
    }

    const urls: SitemapUrl[] = []

    for (const projectPage of projectPageResponse.data.items) {
      const slug = projectPage.fields.slug?.[LOCALE]
      const enSlug = projectPage.fields.slug?.[EN_LOCALE]
      if (!slug && !enSlug) continue
      const loc =
        slug && projectPage.fields.title?.[LOCALE]
          ? `https://island.is/${getProjectPageUrlPrefix(LOCALE)}/${slug}`
          : ''
      const enLoc =
        enSlug && projectPage.fields.title?.[EN_LOCALE]
          ? `https://island.is/${getProjectPageUrlPrefix(EN_LOCALE)}/${enSlug}`
          : ''
      if (!loc && !enLoc) continue
      urls.push({
        loc: {
          [LOCALE]: loc,
          [EN_LOCALE]: enLoc,
        },
        lastmod: projectPage.sys.publishedAt ?? null,
      })
      urls.push({
        loc: {
          [LOCALE]: loc ? `${loc}/frett` : '',
          [EN_LOCALE]: enLoc ? `${enLoc}/news` : '',
        },
      })

      for (const projectSubpage of projectSubpagesByProjectPageId.get(
        projectPage.sys.id,
      ) ?? []) {
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
