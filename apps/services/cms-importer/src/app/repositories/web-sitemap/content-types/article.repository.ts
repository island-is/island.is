import { Injectable } from '@nestjs/common'
import { ManagementClientService } from '../../cms/managementClient/managementClient.service'
import type { SitemapUrl, SitemapUrlFetcher } from '../../../web-sitemap/utils'
import { EN_LOCALE, LOCALE } from '../../../constants'

@Injectable()
export class ArticleRepository implements SitemapUrlFetcher {
  constructor(private readonly managementClient: ManagementClientService) {}

  async getSitemapUrls(
    itemsPerPage: number,
    pageIndex: number,
  ): Promise<{ urls: SitemapUrl[]; nextPageIndex: number }> {
    const articlesResponse = await this.managementClient.getEntries({
      content_type: 'article',
      limit: itemsPerPage,
      select: 'sys,fields.slug,fields.subArticles,fields.title',
      skip: pageIndex * itemsPerPage,
      'sys.publishedAt[exists]': true,
    })
    if (!articlesResponse.ok) throw articlesResponse.error

    const subArticleMap = new Map<
      string,
      { parentArticleSlug: { [LOCALE]: string; [EN_LOCALE]: string } }
    >()
    const subArticleIds: string[] = []

    const urls: SitemapUrl[] = articlesResponse.data.items
      .map((article) => {
        for (const subArticle of article.fields.subArticles?.[LOCALE] ?? []) {
          subArticleMap.set(subArticle.sys.id, {
            parentArticleSlug: article.fields.slug,
          })
          subArticleIds.push(subArticle.sys.id)
        }
        const slug = article.fields.slug?.[LOCALE]
        const enSlug = article.fields.slug?.[EN_LOCALE]
        if (!slug && !enSlug) return null
        return {
          loc: {
            [LOCALE]:
              slug && article.fields.title?.[LOCALE]
                ? `https://island.is/${article.fields.slug[LOCALE]}`
                : '',
            [EN_LOCALE]:
              enSlug && article.fields.title?.[EN_LOCALE]
                ? `https://island.is/en/${article.fields.slug[EN_LOCALE]}`
                : '',
          },
          lastmod: article.sys.publishedAt,
        }
      })
      .filter((url) => url !== null)

    while (subArticleIds.length > 0) {
      const ids = subArticleIds.splice(0, 10)
      const subArticleResponse = await this.managementClient.getEntries({
        content_type: 'subArticle',
        select: 'sys,fields.url,fields.title',
        'sys.id[in]': ids.join(','),
        'sys.publishedAt[exists]': true,
        'fields.url[exists]': true,
      })
      if (!subArticleResponse.ok) throw subArticleResponse.error

      for (const entry of subArticleResponse.data.items) {
        const slug = entry.fields?.url?.[LOCALE]?.split('/')?.pop() ?? ''
        const enSlug = entry.fields?.url?.[EN_LOCALE]?.split('/')?.pop() ?? ''
        if (!slug && !enSlug) continue

        const parentArticleSlug = subArticleMap.get(entry.sys.id)
          ?.parentArticleSlug?.[LOCALE]
        const enParentArticleSlug = subArticleMap.get(entry.sys.id)
          ?.parentArticleSlug?.[EN_LOCALE]
        if (!parentArticleSlug && !enParentArticleSlug) continue
        const url =
          slug && parentArticleSlug && entry.fields.title?.[LOCALE]
            ? `https://island.is/${parentArticleSlug}/${slug}`
            : ''
        const enUrl =
          enSlug && enParentArticleSlug && entry.fields.title?.[EN_LOCALE]
            ? `https://island.is/en/${enParentArticleSlug}/${enSlug}`
            : ''
        urls.push({
          loc: {
            [LOCALE]: url,
            [EN_LOCALE]: enUrl,
          },
          lastmod: entry.sys.publishedAt,
        })
      }
    }

    return {
      urls,
      nextPageIndex:
        articlesResponse.data.total > (pageIndex + 1) * itemsPerPage
          ? pageIndex + 1
          : -1,
    }
  }
}
