import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import {
  SubArticle,
  ProjectPage,
  OrganizationPage,
  OrganizationSubpage,
  News,
  Manual,
  ManualChapterItem,
} from '@island.is/cms'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { SearchableContentTypes } from '@island.is/shared/types'
import { MappedData } from '@island.is/content-search-indexer/types'
import { environment } from '../environments/environment'

type GenerateInvalidationUrlsFunctionType = (
  baseUrl: string,
  document: unknown,
) => string[]

const PATHS: {
  [key in SearchableContentTypes]?: Record<
    ElasticsearchIndexLocale,
    GenerateInvalidationUrlsFunctionType
  >
} = {
  webArticle: {
    is: (baseUrl: string, article: { slug: string }) => [
      `${baseUrl}/${article.slug}`,
    ],
    en: (baseUrl: string, article: { slug: string }) => [
      `${baseUrl}/en/${article.slug}`,
    ],
  },
  webSubArticle: {
    is: (baseUrl: string, subArticle: SubArticle) => [
      `${baseUrl}/${subArticle.slug}`,
    ],
    en: (baseUrl: string, subArticle: SubArticle) => [
      `${baseUrl}/en/${subArticle.slug}`,
    ],
  },
  webProjectPage: {
    is: (baseUrl: string, projectPage: ProjectPage) => [
      `${baseUrl}/v/${projectPage.slug}`,
    ],
    en: (baseUrl: string, projectPage: ProjectPage) => [
      `${baseUrl}/en/p/${projectPage.slug}`,
    ],
  },
  webOrganizationPage: {
    is: (baseUrl: string, organizationPage: OrganizationPage) => [
      `${baseUrl}/s/${organizationPage.slug}`,
    ],
    en: (baseUrl: string, organizationPage: OrganizationPage) => [
      `${baseUrl}/en/o/${organizationPage.slug}`,
    ],
  },
  webOrganizationSubpage: {
    is: (baseUrl: string, subpage: OrganizationSubpage) => [
      `${baseUrl}/s/${subpage.organizationPage.slug}/${subpage.slug}`,
    ],
    en: (baseUrl: string, subpage: OrganizationSubpage) => [
      `${baseUrl}/en/o/${subpage.organizationPage.slug}/${subpage.slug}`,
    ],
  },
  webNews: {
    is: (baseUrl: string, newsItem: News) => {
      const urls = [`${baseUrl}/frett/${newsItem.slug}`]
      if (newsItem.organization?.slug) {
        urls.push(`${baseUrl}/s/${newsItem.organization.slug}/${newsItem.slug}`)
      }
      return urls
    },
    en: (baseUrl: string, newsItem: News) => {
      const urls = [`${baseUrl}/en/news/${newsItem.slug}`]
      if (newsItem.organization?.slug) {
        urls.push(
          `${baseUrl}/en/o/news/${newsItem.organization.slug}/${newsItem.slug}`,
        )
      }
      return urls
    },
  },
  webManual: {
    is: (baseUrl: string, manual: Manual) => [
      `${baseUrl}/handbaekur/${manual.slug}`,
    ],
    en: (baseUrl: string, manual: Manual) => [
      `${baseUrl}/en/manuals/${manual.slug}`,
    ],
  },
  webManualChapterItem: {
    is: (baseUrl: string, chapterItem: ManualChapterItem) => [
      `${baseUrl}/handbaekur/${chapterItem.manual.slug}/${chapterItem.manualChapter.slug}`,
    ],
    en: (baseUrl: string, chapterItem: ManualChapterItem) => [
      `${baseUrl}/en/manuals/${chapterItem.manual.slug}/${chapterItem.manualChapter.slug}`,
    ],
  },
}

const MAX_REQUEST_COUNT = 10

@Injectable()
export class CacheInvalidationService {
  private getBaseUrl() {
    let baseUrl = 'https://island.is'

    switch (environment.runtimeEnvironment) {
      case 'prod':
        baseUrl = 'https://island.is'
        break
      case 'staging':
        baseUrl = 'https://beta.staging01.devland.is'
        break
      case 'dev':
        baseUrl = 'https://beta.dev01.devland.is'
        break
      case 'local':
        baseUrl = 'http://localhost:4200'
        break
      default:
        return
    }

    return baseUrl
  }

  async invalidateCache(items: MappedData[], locale: ElasticsearchIndexLocale) {
    const baseUrl = this.getBaseUrl()
    const bypassSecret = environment.bypassCacheSecret

    const promises: Promise<unknown>[] = []
    let successfulCacheInvalidationCount = 0
    let failedCacheInvalidationCount = 0

    const handleRequests = async () => {
      const responses = await Promise.allSettled(promises)
      const successCount = responses.filter(
        (response) => response.status === 'fulfilled',
      ).length
      successfulCacheInvalidationCount += successCount
      failedCacheInvalidationCount += responses.length - successCount
      promises.length = 0
    }

    const itemsThatCanBeCacheInvalidated = items.filter(
      (item) => item.type in PATHS,
    )

    if (itemsThatCanBeCacheInvalidated.length > 0) {
      logger.info(
        `Invalidating cache for ${itemsThatCanBeCacheInvalidated.length} pages...`,
      )
    }

    for (const item of itemsThatCanBeCacheInvalidated) {
      const generateInvalidationUrls = PATHS[item.type][
        locale
      ] as GenerateInvalidationUrlsFunctionType

      const urls = generateInvalidationUrls(baseUrl, JSON.parse(item.response))

      for (const url of urls) {
        promises.push(fetch(`${url}?bypass-cache=${bypassSecret}`))

        if (promises.length > MAX_REQUEST_COUNT) {
          await handleRequests()
        }
      }
    }

    if (promises.length > 0) {
      await handleRequests()
    }

    if (successfulCacheInvalidationCount > 0) {
      logger.info(
        `Successfully invalidated cache for ${successfulCacheInvalidationCount} pages`,
      )
    }
    if (failedCacheInvalidationCount > 0) {
      logger.warn(
        `Could not invalidate cache for ${failedCacheInvalidationCount} pages`,
      )
    }
  }
}
