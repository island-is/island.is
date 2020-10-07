import {
  ContentfulClientApi,
  createClient,
  CreateClientParams,
  Entry,
  SyncCollection,
} from 'contentful'
import Bottleneck from 'bottleneck'
import environment from '../environments/environment'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import {
  ElasticService,
  SearchIndexes,
  sortDirection,
  SyncOptions,
} from '@island.is/api/content-search'
import _ from 'lodash'
import { PostSyncOptions } from './cmsSync.service'

interface SyncerResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: Entry<any>[]
  deletedItems: string[]
  token: string | undefined
  elasticIndex: string
}

type typeOfSync = { initial: boolean } | { nextSyncToken: string }

@Injectable()
export class ContentfulService {
  private limiter: Bottleneck
  private defaultIncludeDepth = 10
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
    }
    logger.debug('Syncer created', params)
    this.contentfulClient = createClient(params)

    // we dont want the importer to exceed the contentful max requests per second so we cap the request count
    this.limiter = new Bottleneck({
      maxTime: 200, //limit to 5 requests a second
      maxConcurrent: 10, // only allow 10 concurrent requests at a time
    })
  }

  private getFilteredIdString(chunkToProcess: Entry<any>[]): string {
    return chunkToProcess
      .reduce((csvIds, entry) => {
        // contentful sync api does not support limiting the sync to a single content type we filter here to reduce subsequent calls to Contentful
        if (environment.indexableTypes.includes(entry.sys.contentType.sys.id)) {
          csvIds.push(entry.sys.id)
        }
        return csvIds
      }, [])
      .join(',')
  }

  private async getContentfulData(
    chunkIds: string,
    locale: keyof typeof SearchIndexes,
  ) {
    const data = await this.contentfulClient.getEntries({
      include: this.defaultIncludeDepth,
      'sys.id[in]': chunkIds,
      locale: this.contentfulLocaleMap[locale],
    })
    return data.items
  }

  private async getLastSyncToken(elasticIndex: string): Promise<string> {
    const query = {
      types: ['cmsNextSyncToken'],
      sort: { dateUpdated: 'desc' as sortDirection },
      size: 1,
    }
    logger.info('Getting next sync token from index', {
      index: elasticIndex,
    })
    const document = await this.elasticService.getDocumentsByMetaData(
      elasticIndex,
      query,
    )
    return document.hits.hits?.[0]?._source.title
  }

  updateNextSyncToken({ elasticIndex, token }: PostSyncOptions) {
    // we get this next sync token from Contentful on sync request
    const nextSyncTokenDocument = {
      title: token,
      type: 'cmsNextSyncToken',
      dateCreated: new Date().getTime().toString(),
      dateUpdated: new Date().getTime().toString(),
    }

    // write sync token to elastic here as it's own type
    logger.info('Writing next sync token to elasticsearch index')
    return this.elasticService.index(elasticIndex, nextSyncTokenDocument)
  }

  interface
  private async getTypeOfSync({
    fullSync,
    elasticIndex,
  }: {
    fullSync: boolean
    elasticIndex: string
  }): Promise<typeOfSync> {
    if (fullSync) {
      // this is a full sync, get all data
      logger.info('Getting all data from Contentful')
      return { initial: true }
    } else {
      // this is a partial sync, try and get the last sync token else do full sync
      const nextSyncToken = await this.getLastSyncToken(elasticIndex)
      logger.info('Getting data from last sync token found in Contentful', {
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
    entries: Entry<any>[],
    locale: keyof typeof SearchIndexes,
  ): Promise<Entry<any>[]> {
    // contentful has a limit of 1000 entries per request but we get "414 Request URI Too Large" so we do a 500 per request
    const chunkSize = 100
    const chunkedChanges = []
    let chunkToProcess = entries.splice(-chunkSize, chunkSize)
    do {
      const chunkIds = this.getFilteredIdString(chunkToProcess)

      // the content type filter might remove all ids in that case skip trying to get this chunk
      if (chunkIds) {
        logger.info('Getting Contentful data', {
          locale,
          maxChunkSize: chunkSize,
        })
        const items = await this.limiter.schedule(() => {
          // gets the changes for current locale
          return this.getContentfulData(chunkIds, locale)
        })
        chunkedChanges.push(items)
      }
      chunkToProcess = entries.splice(-chunkSize, chunkSize)
    } while (chunkToProcess.length)

    return _.flatten(chunkedChanges)
  }

  /**
   * Search for entries which have a field linking to a specific entry.
   * Useful to finding root/parent of an entry
   *
   * @param linkId
   * @param locale
   * @private
   */
  private async linksToEntry(
    linkId: string,
    locale: string,
  ): Promise<Entry<any>[]> {
    const data = await this.contentfulClient.getEntries({
      include: this.defaultIncludeDepth,
      // eslint-disable-next-line @typescript-eslint/camelcase
      links_to_entry: linkId,
      locale: this.contentfulLocaleMap[locale],
    })
    return data.items
  }

  async getSyncEntries(options: SyncOptions): Promise<SyncerResult> {
    const {
      fullSync,
      locale,
      elasticIndex = SearchIndexes[options.locale],
    } = options
    const typeOfSync = await this.getTypeOfSync({ fullSync, elasticIndex })

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
    const items = await this.getAllEntriesFromContentful(entries, locale)

    // In case of delta updates, we need to resolve embedded entries to their root model
    if (!fullSync && nestedEntries) {
      logger.info('Finding root entries from nestedEntries')
      const alreadyProcessedIds = items.map((entry) => entry.sys.id)
      for (const entryId of nestedEntries) {
        // Due to the limitation of Contentful Sync API, we need to query every entry one at a time
        // with regular sync, triggered by a webhook, these calls 1 - 2 at most
        const linkedEntries = await this.limiter.schedule(() => {
          return this.linksToEntry(entryId, locale)
        })
        linkedEntries.forEach((entry) => {
          // No need to import the same document twice
          if (
            !alreadyProcessedIds.includes(entry.sys.id) &&
            environment.indexableTypes.includes(entry.sys.contentType.sys.id)
          ) {
            items.push(entry)
          }
        })
      }
    }

    // extract ids from deletedEntries
    const deletedItems = deletedEntries.map((entry) => entry.sys.id)

    return {
      token: newNextSyncToken,
      items,
      deletedItems,
      elasticIndex
    }
  }
}
