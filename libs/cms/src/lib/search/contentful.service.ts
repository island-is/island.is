import {
  ClientLogLevel,
  ContentfulClientApi,
  createClient,
  CreateClientParams,
  Entry,
  EntryCollection,
  SyncCollection as ContentfulSyncCollection,
  Sys,
} from 'contentful'
import Bottleneck from 'bottleneck'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import environment from '../environments/environment'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { ElasticService } from '@island.is/content-search-toolkit'
import flatten from 'lodash/flatten'
import { SyncOptions } from '@island.is/content-search-indexer/types'
import {
  ElasticsearchIndexLocale,
  getElasticsearchIndex,
} from '@island.is/content-search-index-manager'
import { Locale } from '@island.is/shared/types'
import type { ApiResponse } from '@elastic/elasticsearch'
import type { SearchResponse } from '@island.is/shared/types'
import type { MappedData } from '@island.is/content-search-indexer/types'
import { MappingService } from './mapping.service'

type SyncCollection = ContentfulSyncCollection & {
  nextPageToken?: string
}

const MAX_REQUEST_COUNT = 10

const MAX_RETRY_COUNT = 3
const INITIAL_DELAY = 500

// Taken from here: https://github.com/contentful/contentful-sdk-core/blob/054328ba2d0df364a5f1ce6d164c5018efb63572/lib/create-http-client.js#L34-L42
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultContentfulClientLogging = (level: ClientLogLevel, data: any) => {
  if (level === 'error' && data) {
    const title = [data.name, data.message].filter((a) => a).join(' - ')
    logger.error(`[error] ${title}`)
    logger.error(data)
    return
  }
  logger.info(`[${level}] ${data}`)
}

interface SyncerResult {
  token: string
  items: Entry<unknown>[]
  deletedEntryIds: string[]
  elasticIndex: string
  nextPageToken?: string
}

interface UpdateNextSyncTokenOptions {
  token: string
  elasticIndex: string
}

type typeOfSync =
  | { initial: boolean }
  | { nextSyncToken: string }
  | { nextPageToken: string }

@Injectable()
export class ContentfulService {
  private limiter: Bottleneck
  private defaultIncludeDepth = 4
  private contentfulClient: ContentfulClientApi
  // TODO: Make the contentful locale reflect the api locale
  // contentful locale does not always reflect the api locale so we need this map
  private contentfulLocaleMap = {
    is: 'is-IS',
    en: 'en',
  }

  constructor(
    private readonly elasticService: ElasticService,
    private readonly featureFlagService: FeatureFlagService,
    private readonly mappingService: MappingService,
  ) {
    const params: CreateClientParams = {
      space: environment.contentful.space,
      accessToken: environment.contentful.accessToken,
      environment: environment.contentful.environment,
      host: environment.contentful.host,
      removeUnresolved: true,
      logHandler(level, data) {
        const logContainsRateLimitWarning =
          level === 'warning' &&
          typeof data === 'string' &&
          data.includes('Rate limit')

        if (logContainsRateLimitWarning) {
          logger.debug(`Search indexer sync caused rate limit - ${data}`)
          return
        }

        defaultContentfulClientLogging(level, data)
      },
    }
    logger.debug('Syncer created', params)
    this.contentfulClient = createClient(params)

    // we dont want the importer to exceed the contentful max requests per second so we cap the request count
    this.limiter = new Bottleneck({
      maxTime: 200, //limit to 5 requests a second
      maxConcurrent: 10, // only allow 10 concurrent requests at a time
    })
  }

  private getFilteredIds(chunkToProcess: { sys: Sys }[]): string[] {
    return chunkToProcess.reduce((csvIds: string[], entry) => {
      // contentful sync api does not support limiting the sync to a single content type we filter here to reduce subsequent calls to Contentful
      if (environment.indexableTypes.includes(entry.sys.contentType.sys.id)) {
        csvIds.push(entry.sys.id)
      }
      return csvIds
    }, [])
  }

  async getContentfulData(
    chunkSize: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query?: any,
  ) {
    const items: Entry<unknown>[] = []
    let response: EntryCollection<unknown> | null = null

    while (
      chunkSize > 0 &&
      (response === null || items.length < response.total)
    ) {
      try {
        response = await this.limiter.schedule(() =>
          this.contentfulClient.getEntries({
            ...query,
            limit: chunkSize,
            skip: items.length,
          }),
        )
        for (const item of response.items) {
          items.push(item)
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (
          (error?.message as string)
            ?.toLowerCase()
            ?.includes('response size too big')
        ) {
          logger.info(
            `Chunk size too large, dividing it by 2: ${chunkSize} -> ${Math.floor(
              chunkSize / 2,
            )}`,
          )
          chunkSize = Math.floor(chunkSize / 2)
        } else {
          logger.error(error)
          return items
        }
      }
    }

    return items
  }

  async getContentfulDataPaginated(
    chunkSize: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: any,
    skip: number,
  ) {
    const items: Entry<unknown>[] = []
    let response: EntryCollection<unknown> | null = null

    while (response === null && chunkSize > 0) {
      try {
        response = await this.limiter.schedule(() =>
          this.contentfulClient.getEntries({
            ...query,
            limit: chunkSize,
            skip,
          }),
        )
        for (const item of response.items) {
          items.push(item)
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (
          (error?.message as string)
            ?.toLowerCase()
            ?.includes('response size too big')
        ) {
          logger.info(
            `Chunk size too large, dividing it by 2: ${chunkSize} -> ${Math.floor(
              chunkSize / 2,
            )}`,
          )
          chunkSize = Math.floor(chunkSize / 2)
        } else {
          logger.error(error)
          return { items, total: response?.total }
        }
      }
    }

    return { items, total: response?.total }
  }

  /**
   * Next sync token is returned by Contentful sync API to mark starting point for next sync.
   * We keep this token in elasticsearch per locale.
   * This token is only used in "fromLast" type syncs
   */
  private async getNextSyncToken(elasticIndex: string): Promise<string> {
    logger.info('Getting next sync token from index', {
      index: elasticIndex,
    })
    // return last folder hash found in elasticsearch else return empty string
    return this.elasticService
      .findById(elasticIndex, 'cmsNextSyncTokenId')
      .then((document) => document.body._source.title)
      .catch((error) => {
        // we expect this to throw when this does not exist, this might happen if we reindex a fresh elasticsearch index
        logger.warn('Failed to get next sync token', {
          error: error.message,
        })
        return ''
      })
  }

  updateNextSyncToken({ elasticIndex, token }: UpdateNextSyncTokenOptions) {
    // we get this next sync token from Contentful on sync request
    const nextSyncTokenDocument = {
      _id: 'cmsNextSyncTokenId',
      title: token,
      type: 'cmsNextSyncToken',
      dateCreated: new Date().getTime().toString(),
      dateUpdated: new Date().getTime().toString(),
    }

    // write sync token to elastic here as it's own type
    logger.info('Writing next sync token to elasticsearch index')
    return this.elasticService.index(elasticIndex, nextSyncTokenDocument)
  }

  private async getTypeOfSync({
    syncType,
    elasticIndex,
    nextPageToken,
  }: {
    syncType: SyncOptions['syncType']
    elasticIndex: string
    nextPageToken?: string
  }): Promise<typeOfSync> {
    if (nextPageToken) {
      logger.info('Getting data from next page token found in Contentful', {
        elasticIndex,
        nextPageToken,
      })
      return { nextPageToken }
    }
    if (syncType === 'full') {
      // this is a full sync, get all data
      logger.info('Getting all data from Contentful')
      return { initial: true }
    } else {
      // this is a partial sync, try and get next sync token else do full sync
      const nextSyncToken = await this.getNextSyncToken(elasticIndex)
      logger.info('Getting data from next sync token found in Contentful', {
        elasticIndex,
        nextSyncToken,
      })
      return nextSyncToken ? { nextSyncToken } : { initial: true }
    }
  }

  async getSyncData(typeOfSync: typeOfSync) {
    const syncData = await (
      this.contentfulClient.sync as (
        query: unknown,
        options: unknown,
      ) => Promise<SyncCollection>
    )(
      {
        ...typeOfSync,
      },
      {
        // So we get a paginated response (sounds counter-intuitive to set paginate to false but that's how it is)
        // This was derived from reading the contentfulClient source code: https://github.com/contentful/contentful.js/blob/8f88492583f657d8689f40a409f08e3161fb0a7d/lib/paged-sync.js
        paginate: false,
      },
    )

    // Remove unnecessary fields to save memory
    for (let i = 0; i < syncData.entries.length; i += 1) {
      syncData.entries[i] = {
        ...syncData.entries[i],
        fields: {
          // In case the entry can be turned off via activeTranslations toggle we want to keep that information
          activeTranslations: syncData.entries[i].fields?.activeTranslations,
        },
      }
    }

    return syncData
  }

  private async getPopulatedContentulEntries(
    entries: { sys: Sys }[],
    locale: ElasticsearchIndexLocale,
    chunkSize: number,
  ): Promise<Entry<unknown>[]> {
    const chunkedChanges = []
    let chunkToProcess = entries.splice(-chunkSize, chunkSize)
    do {
      const chunkIds = this.getFilteredIds(chunkToProcess)

      // the content type filter might remove all ids in that case skip trying to get this chunk
      if (chunkIds.length) {
        // gets the changes for current locale
        const items = await this.getContentfulData(chunkSize, {
          include: this.defaultIncludeDepth,
          'sys.id[in]': chunkIds.join(','),
          locale: this.contentfulLocaleMap[locale],
        })

        chunkedChanges.push(items)
      }
      chunkToProcess = entries.splice(-chunkSize, chunkSize)
    } while (chunkToProcess.length)

    return flatten(chunkedChanges)
  }

  /**
   * Gets entries from the Sync API, fetches nested content from Contentful and returns the result
   */
  private async getPopulatedSyncEntries(
    typeOfSync: typeOfSync,
    locale: Locale,
    chunkSize: number,
  ) {
    const isDeltaUpdate = !('initial' in typeOfSync)
    const resyncInformationPrefix = 're-sync-data-'

    const resyncNextPageInformation =
      'nextPageToken' in typeOfSync &&
      typeOfSync.nextPageToken.startsWith(resyncInformationPrefix)
        ? typeOfSync.nextPageToken
        : ''

    if (
      Boolean(resyncNextPageInformation) ||
      (!resyncNextPageInformation && !isDeltaUpdate)
    ) {
      const info: {
        skip: number
      } = resyncNextPageInformation
        ? JSON.parse(
            resyncNextPageInformation.split(resyncInformationPrefix)[1],
          )
        : {
            skip: 0,
          }

      const contentfulData = await this.getContentfulDataPaginated(
        chunkSize,
        {
          include: this.defaultIncludeDepth,
          'sys.contentType.sys.id[in]': environment.indexableTypes.join(','),
          locale: this.contentfulLocaleMap[locale],
        },
        info.skip,
      )

      info.skip += contentfulData.items.length

      return {
        indexableEntries: contentfulData.items,
        nestedItems: [],
        deletedEntryIds: [],
        newNextSyncToken: '',
        nextPageToken:
          typeof contentfulData?.total === 'number' &&
          info.skip < contentfulData.total
            ? `${resyncInformationPrefix}${JSON.stringify(info)}`
            : '',
      }
    }

    // Gets all changes in all locales
    const {
      entries,
      nextSyncToken: newNextSyncToken,
      nextPageToken,
      deletedEntries,
      assets,
      deletedAssets,
    } = await this.getSyncData(typeOfSync)

    // In case someone in the CMS triggers a sync by setting the translation of an entry to an inactive state we'd like to remove that entry
    const entriesThatHadTheirTranslationTurnedOff = new Set<string>()

    if (isDeltaUpdate && locale !== 'is') {
      const localizedEntries = entries.filter((entry) =>
        environment.localizedContentTypes.includes(
          entry.sys.contentType.sys.id,
        ),
      )
      for (const localizedEntry of localizedEntries) {
        const translationIsActive =
          localizedEntry.fields.activeTranslations?.[
            this.contentfulLocaleMap.is
          ]?.[locale] ?? true

        if (!translationIsActive) {
          entriesThatHadTheirTranslationTurnedOff.add(localizedEntry.sys.id)
        }
      }
    }

    const nestedItems = entries
      .filter((entry) =>
        environment.nestedContentTypes.includes(entry.sys.contentType.sys.id),
      )
      .map((entry) => ({ id: entry.sys.id, isEntry: true }))
      .concat(assets.map((asset) => ({ id: asset.sys.id, isEntry: false })))
      .concat(
        deletedAssets.map((asset) => ({ id: asset.sys.id, isEntry: false })),
      )

    logger.info('Sync found entries', {
      entries: entries.length,
      deletedEntries: deletedEntries.length,
      nestedItems: nestedItems.length,
    })

    // Get all sync entries from Contentful endpoints for this locale, we could parse the sync response into locales but we are opting for this for simplicity
    const indexableEntries = await this.getPopulatedContentulEntries(
      entries.filter(
        (entry) =>
          !entriesThatHadTheirTranslationTurnedOff.has(entry.sys.id) &&
          // Only populate the indexable entries
          environment.indexableTypes.includes(entry.sys.contentType.sys.id),
      ),
      locale,
      chunkSize,
    )

    // extract ids from deletedEntries
    const deletedEntryIds = deletedEntries.map((entry) => entry.sys.id)

    for (const entryId of entriesThatHadTheirTranslationTurnedOff) {
      deletedEntryIds.push(entryId)
    }

    return {
      indexableEntries,
      nestedItems,
      deletedEntryIds,
      newNextSyncToken,
      nextPageToken,
    }
  }

  private async resolveNestedEntries(
    ids: string[],
    elasticIndex: string,
    locale: ElasticsearchIndexLocale,
    chunkSize: number,
    indexableEntries: Entry<unknown>[],
  ) {
    const idsCopy = [...ids]
    let idsChunk = idsCopy.splice(-MAX_REQUEST_COUNT, MAX_REQUEST_COUNT)

    let nestedProgress = idsChunk.length
    const totalNested = ids.length

    while (idsChunk.length > 0) {
      const size = 100
      let page = 1

      const items: string[] = []

      let response: ApiResponse<SearchResponse<MappedData>> | null = null
      let total = -1

      let delay = INITIAL_DELAY
      let retries = MAX_RETRY_COUNT

      while (response === null || items.length < total) {
        try {
          response = await this.elasticService.findByQuery(elasticIndex, {
            query: {
              bool: {
                should: idsChunk.map((id) => ({
                  nested: {
                    path: 'tags',
                    query: {
                      bool: {
                        must: [
                          {
                            term: {
                              'tags.key': id,
                            },
                          },
                          {
                            term: {
                              'tags.type': 'hasChildEntryWithId',
                            },
                          },
                        ],
                      },
                    },
                  },
                })),
                minimum_should_match: 1,
              },
            },
            size,
            from: (page - 1) * size,
          })
          // Reset variables in case we successfully receive a response
          delay = INITIAL_DELAY
          retries = MAX_RETRY_COUNT
        } catch (error) {
          if (error?.statusCode === 429 && retries > 0) {
            logger.info('Retrying nested resolution request...', {
              retriesLeft: retries - 1,
              delay,
            })
            await new Promise((resolve) => {
              setTimeout(resolve, delay)
            })
            // Keep track of how often and for how long we should wait in case of failure
            retries -= 1
            delay *= 2
            continue
          } else {
            throw error
          }
        }

        if (response.body.hits.hits.length === 0) {
          total = response.body.hits.total.value
          break
        }

        // In case the total changes during the pagination fetches we only reference the initial total
        if (total === -1) {
          total = response.body.hits.total.value
        }

        for (const hit of response.body.hits.hits) {
          items.push(hit._id)
        }

        page += 1
      }

      // Fetch root entries from Contentful in chunks
      {
        const rootEntryIds = items.filter(
          // Remove duplicates
          (id) => !indexableEntries.some((entry) => entry.sys.id === id),
        )

        let progress = 0
        const total = rootEntryIds.length

        let chunkIds = rootEntryIds.splice(-chunkSize, chunkSize)
        progress += chunkIds.length

        while (chunkIds.length > 0) {
          const items = await this.getContentfulData(chunkSize, {
            include: this.defaultIncludeDepth,
            'sys.id[in]': chunkIds.join(','),
            locale: this.contentfulLocaleMap[locale],
          })

          // import data from all providers
          const { mappedData: importableData, entriesToDelete } =
            this.mappingService.mapData(items)

          await this.elasticService.bulk(elasticIndex, {
            add: flatten(importableData),
            remove: entriesToDelete,
          })

          logger.info(
            `${progress}/${total} resolved root entries have been synced`,
          )

          chunkIds = rootEntryIds.splice(-chunkSize, chunkSize)
          progress += chunkIds.length
        }
      }

      logger.info(
        `${nestedProgress}/${totalNested} nested entries have been resolved`,
      )

      idsChunk = idsCopy.splice(-MAX_REQUEST_COUNT, MAX_REQUEST_COUNT)
      nestedProgress += idsChunk.length
    }
  }

  async getSyncEntries(options: SyncOptions): Promise<SyncerResult> {
    const {
      syncType,
      locale,
      elasticIndex = getElasticsearchIndex(options.locale),
    } = options
    const typeOfSync = await this.getTypeOfSync({
      syncType,
      elasticIndex,
      nextPageToken: options.nextPageToken,
    })

    // Contentful only allows a maximum of 7MB response size, so this chunkSize variable allows us to tune down how many entries we fetch in one request
    const chunkSize = Number(
      process.env.CONTENTFUL_ENTRY_FETCH_CHUNK_SIZE ?? 40,
    )

    logger.info(`Sync chunk size is: ${chunkSize}`)

    const {
      indexableEntries,
      newNextSyncToken,
      deletedEntryIds,
      nextPageToken,
      nestedItems,
    } = await this.getPopulatedSyncEntries(typeOfSync, locale, chunkSize)

    const isDeltaUpdate = syncType === 'fromLast'

    let shouldResolveNestedEntries = false
    if (environment.runtimeEnvironment === 'local') {
      shouldResolveNestedEntries = Boolean(
        environment.forceSearchIndexerToResolveNestedEntries,
      )
    } else {
      shouldResolveNestedEntries = await this.featureFlagService.getValue(
        Features.shouldSearchIndexerResolveNestedEntries,
        true,
      )
    }

    const nestedItemIds = nestedItems
      .map(({ id }) => id)
      .concat(deletedEntryIds)

    // In case of delta updates, we need to resolve embedded entries to their root model
    if (
      isDeltaUpdate &&
      shouldResolveNestedEntries &&
      nestedItemIds.length > 0
    ) {
      logger.info('Finding root entries from nestedEntries')

      const previousLength = indexableEntries.length

      await this.resolveNestedEntries(
        nestedItemIds,
        elasticIndex,
        locale,
        chunkSize,
        indexableEntries,
      )

      logger.info(
        `Found ${
          indexableEntries.length - previousLength
        } root entries from nested entries`,
      )
    }

    return {
      token: newNextSyncToken,
      items: indexableEntries,
      deletedEntryIds,
      elasticIndex,
      nextPageToken,
    }
  }
}
