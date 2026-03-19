import { Injectable } from '@nestjs/common'
import type { SitemapUrl, SitemapUrlFetcher } from '../../web-sitemap/utils'
import { FrontpageRepository } from './content-types/frontpage.repository'
import { ArticleRepository } from './content-types/article.repository'
import { OrganizationPageRepository } from './content-types/organizationPage.repository'
import { OrganizationSubpageRepository } from './content-types/organizationSubpage.repository'
import { OrganizationParentSubpageRepository } from './content-types/organizationParentSubpage.repository'
import { ProjectPageRepository } from './content-types/projectPage.repository'
import { ManualRepository } from './content-types/manual.repository'

@Injectable()
export class WebSitemapRepository {
  private readonly fetchers: SitemapUrlFetcher[]

  constructor(
    private readonly frontpageRepository: FrontpageRepository,
    private readonly articleRepository: ArticleRepository,
    private readonly organizationPageRepository: OrganizationPageRepository,
    private readonly organizationSubpageRepository: OrganizationSubpageRepository,
    private readonly organizationParentSubpageRepository: OrganizationParentSubpageRepository,
    private readonly projectPageRepository: ProjectPageRepository,
    private readonly manualRepository: ManualRepository,
  ) {
    this.fetchers = [
      this.frontpageRepository,
      this.articleRepository,
      this.organizationPageRepository,
      this.organizationSubpageRepository,
      this.organizationParentSubpageRepository,
      this.projectPageRepository,
      this.manualRepository,
    ]
  }

  async getSitemapUrls(
    fetcherIndex = 0,
    pageIndex = 0,
  ): Promise<{
    urls: SitemapUrl[]
    nextFetcherIndex: number
    nextPageIndex: number
  }> {
    if (
      fetcherIndex < 0 ||
      fetcherIndex >= this.fetchers.length ||
      pageIndex < 0
    )
      return { urls: [], nextFetcherIndex: -1, nextPageIndex: -1 }

    const itemsPerPage = 100
    const maxUrls = 100

    let total = 0
    const resultUrls: SitemapUrl[] = []

    for (let i = fetcherIndex; i < this.fetchers.length; i += 1) {
      if (total >= maxUrls)
        return {
          urls: resultUrls,
          nextFetcherIndex: i,
          nextPageIndex: pageIndex,
        }

      const fetcher = this.fetchers[i]
      let response: Awaited<ReturnType<typeof fetcher.getSitemapUrls>>

      do {
        response = await fetcher.getSitemapUrls(itemsPerPage, pageIndex)
        total += response.urls.length
        resultUrls.push(...response.urls)
        if (total >= maxUrls)
          return {
            urls: resultUrls,
            nextFetcherIndex: i,
            nextPageIndex: response.nextPageIndex,
          }
      } while (response.nextPageIndex >= 0 && response.urls.length > 0)
    }

    return { urls: resultUrls, nextFetcherIndex: -1, nextPageIndex: -1 }
  }
}
