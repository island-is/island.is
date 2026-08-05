import { Injectable } from '@nestjs/common'
import { getProjectPageUrlPrefix } from '@island.is/shared/utils'
import type { SitemapUrl, SitemapUrlFetcher } from '../../../web-sitemap/utils'
import { ManagementClientService } from '../../cms/managementClient/managementClient.service'
import { LOCALE } from '../../../constants'
import { EN_LOCALE } from '../../../constants'

@Injectable()
export class ProjectNewsRepository implements SitemapUrlFetcher {
  constructor(private readonly managementClient: ManagementClientService) {}

  async getSitemapUrls(
    itemsPerPage: number,
    pageIndex: number,
  ): Promise<{ urls: SitemapUrl[]; nextPageIndex: number }> {
    const allProjectPages: {
      slug: { [LOCALE]: string; [EN_LOCALE]: string }
      title: { [LOCALE]: string; [EN_LOCALE]: string }
      newsTagId: string | undefined
    }[] = []

    const tagIdToProjectPageMap = new Map<
      string,
      {
        slug: { [LOCALE]: string; [EN_LOCALE]: string }
        title: { [LOCALE]: string; [EN_LOCALE]: string }
      }
    >()

    {
      let projectPageResponse: Awaited<
        ReturnType<typeof this.managementClient.getEntries>
      >
      let skip = 0
      do {
        projectPageResponse = await this.managementClient.getEntries({
          content_type: 'projectPage',
          select: 'fields.slug,fields.title,fields.newsTag',
          'sys.publishedAt[exists]': true,
          'fields.newsTag[exists]': true,
          limit: itemsPerPage,
          skip,
        })
        if (!projectPageResponse.ok) throw projectPageResponse.error
        allProjectPages.push(
          ...projectPageResponse.data.items.map((item) => {
            const newsTagId = item.fields.newsTag?.[LOCALE]?.sys?.id
            if (newsTagId)
              tagIdToProjectPageMap.set(newsTagId, {
                slug: item.fields.slug,
                title: item.fields.title,
              })
            return {
              slug: item.fields.slug,
              title: item.fields.title,
              newsTagId,
            }
          }),
        )
        skip += projectPageResponse.data.items.length
      } while (projectPageResponse.data.total > skip)
    }

    const newsResponse = await this.managementClient.getEntries({
      content_type: 'news',
      select: 'sys,fields.slug,fields.title,fields.genericTags',
      'sys.publishedAt[exists]': true,
      'fields.genericTags.sys.id[in]': allProjectPages
        .map((item) => item.newsTagId)
        .filter(Boolean)
        .join(','),
      limit: itemsPerPage,
      skip: pageIndex * itemsPerPage,
    })
    if (!newsResponse.ok) throw newsResponse.error

    const urls: SitemapUrl[] = []
    for (const item of newsResponse.data.items) {
      const slug = item.fields.slug?.[LOCALE]
      const enSlug = item.fields.slug?.[EN_LOCALE]
      if (!slug && !enSlug) continue
      const projectPage = tagIdToProjectPageMap.get(
        item.fields.genericTags?.[LOCALE]?.find(
          (tag: { sys: { id: string } }) =>
            tagIdToProjectPageMap.get(tag.sys.id),
        )?.sys.id,
      )
      if (!projectPage) continue
      const projectPageSlug = projectPage.slug?.[LOCALE]
      const projectPageEnSlug = projectPage.slug?.[EN_LOCALE]
      if (!projectPageSlug && !projectPageEnSlug) continue
      urls.push({
        loc: {
          [LOCALE]:
            slug && projectPageSlug && item.fields.title?.[LOCALE]
              ? `https://island.is/${getProjectPageUrlPrefix(
                  LOCALE,
                )}/${projectPageSlug}/frett/${slug}`
              : '',
          [EN_LOCALE]:
            enSlug && projectPageEnSlug && item.fields.title?.[EN_LOCALE]
              ? `https://island.is/${getProjectPageUrlPrefix(
                  EN_LOCALE,
                )}/${projectPageEnSlug}/news/${enSlug}`
              : '',
        },
        lastmod: item.sys.publishedAt,
      })
    }

    return {
      urls,
      nextPageIndex:
        newsResponse.data.total > (pageIndex + 1) * itemsPerPage
          ? pageIndex + 1
          : -1,
    }
  }
}
