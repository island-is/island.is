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
    let baseUrl = 'http://web.islandis.svc.cluster.local'
    if (environment.runtimeEnvironment === 'local') {
      baseUrl = 'http://localhost:4200'
    }
    return baseUrl
  }

  async invalidateCache(items: MappedData[], locale: ElasticsearchIndexLocale) {
    const baseUrl = this.getBaseUrl()

    const bypassSecret = environment.bypassCacheSecret

    const promises: { url: string; promise: Promise<unknown> }[] = []
    let successfulCacheInvalidationCount = 0
    const failedCacheInvalidationReasons: { url: string; reason: unknown }[] =
      []

    const handleRequests = async () => {
      const responses = await Promise.allSettled(
        promises.map(({ promise }) => promise),
      )
      for (let i = 0; i < responses.length; i += 1) {
        const response = responses[i]
        const url = promises[i].url
        if (response.status === 'fulfilled') {
          ;(response.value as Response).text().then((value) => {
            logger.info(`Received response for: ${url}`, { data: value })
          })
          successfulCacheInvalidationCount += 1
        } else {
          failedCacheInvalidationReasons.push({
            url,
            reason: response.reason,
          })
        }
      }
      promises.length = 0
    }

    const itemsThatCanBeCacheInvalidated = items.filter(
      (item) => item.type in PATHS,
    )

    if (itemsThatCanBeCacheInvalidated.length > 0) {
      logger.info(
        `Invalidating cache for ${itemsThatCanBeCacheInvalidated.length} ${
          itemsThatCanBeCacheInvalidated.length === 1 ? 'document' : 'documents'
        }...`,
      )
    }

    for (const item of itemsThatCanBeCacheInvalidated) {
      const generateInvalidationUrls = PATHS[item.type][
        locale
      ] as GenerateInvalidationUrlsFunctionType

      let urls: string[] = []

      try {
        urls = generateInvalidationUrls(baseUrl, JSON.parse(item.response))
      } catch {
        logger.warn(`Generating invalidation url failed for: ${item._id}`)
        continue
      }

      for (const urlWithoutPostfix of urls) {
        const url = `${urlWithoutPostfix}?bypass-cache=${bypassSecret}`
        promises.push({
          url: urlWithoutPostfix,
          promise: fetch(url, {
            headers: {
              'Cache-Control': 'no-cache',
            },
          }),
        })
        logger.info(`Invalidating: ${urlWithoutPostfix}`)
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
        `Successfully invalidated cache for ${successfulCacheInvalidationCount} urls`,
      )
    }
    if (failedCacheInvalidationReasons.length > 0) {
      logger.warn(
        `Could not invalidate cache for ${failedCacheInvalidationReasons.length} urls`,
        failedCacheInvalidationReasons,
      )
    }
  }
}
