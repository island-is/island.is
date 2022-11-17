import {
  ContentfulClientApi,
  createClient,
  CreateClientParams,
  Entry,
  EntryCollection,
  SyncCollection,
} from 'contentful'
import Bottleneck from 'bottleneck'
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
import { Locale } from 'locale'

interface SyncerResult {
  items: Entry<unknown>[]
  deletedItems: string[]
  token: string
  elasticIndex: string
}

interface UpdateNextSyncTokenOptions {
  token: string
  elasticIndex: string
}

type typeOfSync = { initial: boolean } | { nextSyncToken: string }

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

  constructor(private readonly elasticService: ElasticService) {
    const params: CreateClientParams = {
      space: environment.contentful.space,
      accessToken: environment.contentful.accessToken,
      environment: environment.contentful.environment,
      host: environment.contentful.host,
      removeUnresolved: true,
    }
    logger.debug('Syncer created', params)
    this.contentfulClient = createClient(params)

    // we dont want the importer to exceed the contentful max requests per second so we cap the request count
    this.limiter = new Bottleneck({
      maxTime: 200, //limit to 5 requests a second
      maxConcurrent: 10, // only allow 10 concurrent requests at a time
    })
  }

  private getFilteredIds(chunkToProcess: Entry<unknown>[]): string[] {
    return chunkToProcess.reduce((csvIds: string[], entry) => {
      // contentful sync api does not support limiting the sync to a single content type we filter here to reduce subsequent calls to Contentful
      if (environment.indexableTypes.includes(entry.sys.contentType.sys.id)) {
        csvIds.push(entry.sys.id)
      }
      return csvIds
    }, [])
  }

  private async getContentfulData(
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
          logger.error(error.message)
          return items
        }
      }
    }

    return items
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
  }: {
    syncType: SyncOptions['syncType']
    elasticIndex: string
  }): Promise<typeOfSync> {
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

  private getSyncData(typeOfSync: typeOfSync): Promise<SyncCollection> {
    return this.contentfulClient.sync({
      resolveLinks: true,
      ...typeOfSync,
    })
  }

  private async getAllEntriesFromContentful(
    entries: Entry<unknown>[],
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
    // gets all changes in all locales
    const {
      entries,
      nextSyncToken: newNextSyncToken,
      deletedEntries,
    } = await this.getSyncData(typeOfSync)

    const nestedEntries = entries
      .filter((entry) =>
        environment.nestedContentTypes.includes(entry.sys.contentType.sys.id),
      )
      .map((entry) => entry.sys.id)

    logger.info('Sync found entries', {
      entries: entries.length,
      deletedEntries: deletedEntries.length,
      nestedEntries: nestedEntries.length,
    })

    // get all sync entries from Contentful endpoints for this locale, we could parse the sync response into locales but we are opting for this for simplicity
    const items = await this.getAllEntriesFromContentful(
      entries,
      locale,
      chunkSize,
    )

    // extract ids from deletedEntries
    const deletedItems = deletedEntries.map((entry) => entry.sys.id)

    return {
      items,
      nestedEntries,
      newNextSyncToken,
      deletedItems,
    }
  }

  async getSyncEntries(options: SyncOptions): Promise<SyncerResult> {
    const {
      syncType,
      locale,
      elasticIndex = getElasticsearchIndex(options.locale),
    } = options
    const typeOfSync = await this.getTypeOfSync({ syncType, elasticIndex })

    // Contentful only allows a maximum of 7MB response size, so this chunkSize variable allows us to tune down how many entries we fetch in one request
    const chunkSize = Number(
      process.env.CONTENTFUL_ENTRY_FETCH_CHUNK_SIZE ?? 40,
    )

    logger.info(`Sync chunk size is: ${chunkSize}`)

    const populatedSyncEntriesResult = await this.getPopulatedSyncEntries(
      typeOfSync,
      locale,
      chunkSize,
    )

    const { items, newNextSyncToken, deletedItems } = populatedSyncEntriesResult
    let { nestedEntries } = populatedSyncEntriesResult

    // In case of delta updates, we need to resolve embedded entries to their root model
    if (syncType !== 'full' && nestedEntries) {
      logger.info('Finding root entries from nestedEntries')

      for (let i = 0; i < this.defaultIncludeDepth; i += 1) {
        const linkedEntries = []
        for (const entryId of nestedEntries) {
          // We fetch the entries that are linking to our nested entries
          linkedEntries.push(
            ...(
              await this.getContentfulData(chunkSize, {
                include: this.defaultIncludeDepth,
                links_to_entry: entryId,
                locale: this.contentfulLocaleMap[locale],
              })
            ).filter(
              (entry) => !items.some((item) => item.sys.id === entry.sys.id),
            ),
          )
        }
        items.push(
          ...linkedEntries.filter((entry) =>
            environment.indexableTypes.includes(entry.sys.contentType.sys.id),
          ),
        )
        // Next round of the loop will only find linked entries to these entries
        nestedEntries = linkedEntries.map((entry) => entry.sys.id)
        logger.info(
          `Found ${linkedEntries.length} nested entries at depth ${i + 1}`,
        )
      }
    }

    return {
      token: newNextSyncToken,
      items,
      deletedItems,
      elasticIndex,
    }
  }
}
