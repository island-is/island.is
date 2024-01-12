import { Injectable } from '@nestjs/common'

import { ElasticService } from '@island.is/content-search-toolkit'
import { logger } from '@island.is/logging'
import {
  CmsSyncService,
  Manual,
  ManualChapterItem,
  News,
  OrganizationPage,
  OrganizationSubpage,
  ProjectPage,
  SubArticle,
} from '@island.is/cms'
import {
  ContentSearchImporter,
  MappedData,
  SyncOptions,
  SyncResponse,
} from '@island.is/content-search-indexer/types'
import {
  ElasticsearchIndexLocale,
  getElasticsearchIndex,
} from '@island.is/content-search-index-manager'
import { environment } from '../environments/environment'
import { Entry } from 'contentful'
import { writeFileSync } from 'fs'
import { inspect } from 'util'

type SyncStatus = {
  running?: boolean
  lastStart?: string
  lastFinish?: string
}

@Injectable()
export class IndexingService {
  importers: ContentSearchImporter[]
  constructor(
    private readonly elasticService: ElasticService,
    private readonly cmsSyncService: CmsSyncService,
  ) {
    // add importer service to this array to make it import
    this.importers = [this.cmsSyncService]

    // In case the service shut down in the middle of a sync, we need to set "running" to false
    environment.locales.map((locale) => {
      logger.info('Resetting sync status for locale', { locale })
      this.updateSyncStatus(locale as ElasticsearchIndexLocale, {
        running: false,
      })
    })
  }

  async ping() {
    return this.elasticService.ping()
  }

  async invalidateCache(b: MappedData[], locale: ElasticsearchIndexLocale) {
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

    const bypassSecret = environment.bypassCacheSecret

    const paths: Record<
      string,
      Record<typeof locale, (document: unknown) => string[]>
    > = {
      webArticle: {
        is: (article: { slug: string }) => [`${baseUrl}/${article.slug}`],
        en: (article: { slug: string }) => [`${baseUrl}/en/${article.slug}`],
      },
      webSubArticle: {
        is: (subArticle: SubArticle) => [`${baseUrl}/${subArticle.slug}`],
        en: (subArticle: SubArticle) => [`${baseUrl}/en/${subArticle.slug}`],
      },
      webProjectPage: {
        is: (projectPage: ProjectPage) => [`${baseUrl}/v/${projectPage.slug}`],
        en: (projectPage: ProjectPage) => [
          `${baseUrl}/en/p/${projectPage.slug}`,
        ],
      },
      webOrganizationPage: {
        is: (organizationPage: OrganizationPage) => [
          `${baseUrl}/s/${organizationPage.slug}`,
        ],
        en: (organizationPage: OrganizationPage) => [
          `${baseUrl}/en/o/${organizationPage.slug}`,
        ],
      },
      webOrganizationSubpage: {
        is: (subpage: OrganizationSubpage) => [
          `${baseUrl}/s/${subpage.organizationPage.slug}/${subpage.slug}`,
        ],
        en: (subpage: OrganizationSubpage) => [
          `${baseUrl}/en/o/${subpage.organizationPage.slug}/${subpage.slug}`,
        ],
      },
      webNews: {
        is: (newsItem: News) => {
          const urls = [`${baseUrl}/frett/${newsItem.slug}`]
          if (newsItem.organization?.slug) {
            urls.push(
              `${baseUrl}/s/${newsItem.organization.slug}/${newsItem.slug}`,
            )
          }
          return urls
        },
        en: (newsItem: News) => {
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
        is: (manual: Manual) => [`${baseUrl}/handbaekur/${manual.slug}`],
        en: (manual: Manual) => [`${baseUrl}/en/manuals/${manual.slug}`],
      },
      webManualChapterItem: {
        is: (chapterItem: ManualChapterItem) => [
          `${baseUrl}/handbaekur/${chapterItem.manual.slug}/${chapterItem.manualChapter.slug}`,
        ],
        en: (chapterItem: ManualChapterItem) => [
          `${baseUrl}/en/manuals/${chapterItem.manual.slug}/${chapterItem.manualChapter.slug}`,
        ],
      },
    }

    const promises: Promise<unknown>[] = []
    let successfulCacheInvalidationCount = 0
    let failedCacheInvalidationCount = 0

    for (const item of b) {
      if (item.type in paths) {
        const urls = paths[item.type][locale](JSON.parse(item.response))
        for (const url of urls) {
          logger.info(`Invalidating: ${url}?bypass-cache=${bypassSecret}`)
          promises.push(fetch(`${url}?bypass-cache=${bypassSecret}`))
        }
      }

      if (promises.length > 10) {
        const responses = await Promise.allSettled(promises)
        const successCount = responses.filter(
          (response) => response.status === 'fulfilled',
        ).length
        successfulCacheInvalidationCount += successCount
        failedCacheInvalidationCount += responses.length - successCount
        promises.length = 0

        responses.forEach(async (r) => {
          if (r.status === 'fulfilled') {
            const v = await (r.value as { text: () => Promise<string> })?.text()
            writeFileSync(
              item._id + '.js',
              inspect(v.slice(v.indexOf('prufugrein')), true, 999999),
            )
          }
        })
      }
    }
    let i = 0
    if (promises.length > 0) {
      const responses = await Promise.allSettled(promises)
      const successCount = responses.filter(
        (response) => response.status === 'fulfilled',
      ).length
      successfulCacheInvalidationCount += successCount
      failedCacheInvalidationCount += responses.length - successCount
      promises.length = 0
      responses.forEach(async (r) => {
        if (r.status === 'fulfilled') {
          const v = await (r.value as { text: () => Promise<string> })?.text()
          writeFileSync(
            String(i++) + '--' + '.js',
            inspect(v.slice(v.indexOf('prufugrein')), true, 999999),
          )
        }
      })
    }

    if (successfulCacheInvalidationCount > 0) {
      logger.info(
        `Invalidated cache for ${successfulCacheInvalidationCount} pages`,
      )
    }
    if (failedCacheInvalidationCount > 0) {
      logger.warn(
        `Could not invalidate cache for ${failedCacheInvalidationCount} pages`,
      )
    }
  }

  async doSync(options: SyncOptions) {
    const {
      syncType = 'fromLast',
      elasticIndex = getElasticsearchIndex(options.locale),
    } = options

    let didImportAll = true
    const importPromises = this.importers.map(async (importer) => {
      logger.debug('Starting importer', importer)
      logger.info('Starting importer', {
        importer: importer.constructor.name,
        index: elasticIndex,
      })

      let nextPageToken: string | undefined = undefined
      let initialFetch = true
      let postSyncOptions: SyncResponse['postSyncOptions']

      while (initialFetch || nextPageToken) {
        const importerResponse = await importer.doSync({
          ...options,
          nextPageToken,
        })

        // importers can skip import by returning null
        if (!importerResponse) {
          didImportAll = false
          return true
        }

        const {
          nextPageToken: importerResponseNextPageToken,
          postSyncOptions: importerResponsePostSyncOptions,
          ...elasticData
        } = importerResponse
        await this.elasticService.bulk(elasticIndex, elasticData)

        // Wait for some time to make sure data will be returned
        await new Promise((r) => setTimeout(r, 2000))

        // Only invalidate cached pages if we are performing an incremental update
        if (syncType === 'fromLast') {
          await this.invalidateCache(elasticData.add, options.locale)
        }

        nextPageToken = importerResponseNextPageToken
        postSyncOptions = importerResponsePostSyncOptions
        initialFetch = false
      }

      if (importer.postSync) {
        logger.info('Importer started post sync', {
          importer: importer.constructor.name,
          index: elasticIndex,
        })
        // allow importers to clean up after import
        await importer.postSync(postSyncOptions)
      }

      logger.info('Importer finished sync', {
        importer: importer.constructor.name,
        index: elasticIndex,
      })
      return true
    })

    // wait for all importers to finish
    await Promise.all(importPromises).catch((error) => {
      logger.debug('Importer failure error', error)
      logger.error('Importer failed', {
        message: error.message,
        index: elasticIndex,
      })
      didImportAll = false
    })

    /*
    calling the sync endpoint should manage all housekeeping tasks such as removing outdated documents
    we need this check to ensure old data is cleared from the index incase sync fails to remove documents
    currently this happens in cms sync in the development environment due to limitations in the Contentful sync API
    */
    if (syncType === 'full' && didImportAll) {
      logger.info('Removing stale data from index', { index: elasticIndex })
      const response =
        await this.elasticService.deleteAllDocumentsNotVeryRecentlyUpdated(
          elasticIndex,
        )
      logger.info('Removed stale documents', {
        count: response.body.deleted,
        index: elasticIndex,
      })
    }

    logger.info('Indexing service finished sync', { index: elasticIndex })

    return didImportAll
  }

  async getSyncStatus(locale: ElasticsearchIndexLocale): Promise<SyncStatus> {
    const elasticIndex = getElasticsearchIndex(locale)

    return this.elasticService
      .findById(elasticIndex, 'indexingServiceStatusId')
      .then((document) => JSON.parse(document?.body._source.content))
      .catch((error) => {
        logger.warn('Failed to get last indexing service status', {
          error: error.message,
        })
        return { running: false }
      })
  }

  async updateSyncStatus(locale: ElasticsearchIndexLocale, status: SyncStatus) {
    const elasticIndex = getElasticsearchIndex(locale)

    const lastStatus = await this.getSyncStatus(locale)

    const folderHashDocument = {
      _id: 'indexingServiceStatusId',
      title: 'indexingServiceStatus',
      type: 'indexingServiceStatus',
      content: JSON.stringify({ ...lastStatus, ...status }),
      dateCreated: new Date().getTime().toString(),
      dateUpdated: new Date().getTime().toString(),
    }

    logger.info('Writing sync status to elasticsearch index')
    await this.elasticService
      .index(elasticIndex, folderHashDocument)
      .catch((error) => {
        logger.debug('Sync status error', error)
        logger.error('Could not update sync status', {
          message: error.message,
        })
      })
  }

  async getDocumentById(locale: ElasticsearchIndexLocale, id: string) {
    const elasticIndex = getElasticsearchIndex(locale)

    try {
      const document = await this.elasticService.findById(elasticIndex, id)

      return document
    } catch {
      return { error: true }
    }
  }

  async deleteDocument(
    locale: ElasticsearchIndexLocale,
    document: Pick<Entry<unknown>, 'sys'>,
  ) {
    const elasticIndex = getElasticsearchIndex(locale)
    return this.cmsSyncService.handleDocumentDeletion(elasticIndex, document)
  }
}
