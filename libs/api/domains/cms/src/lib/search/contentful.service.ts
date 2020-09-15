import {
  ContentfulClientApi,
  createClient,
  CreateClientParams,
  Entry,
  SyncCollection,
} from 'contentful'
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
}

type typeOfSync = { initial: boolean } | { nextSyncToken: string }

@Injectable()
export class ContentfulService {
  private defaultIncludeDepth = 10
  private contentfulClient: ContentfulClientApi

  constructor(private readonly elasticService: ElasticService) {
    const params: CreateClientParams = {
      space: environment.contentful.space,
      accessToken: environment.contentful.accessToken,
      environment: environment.contentful.environment,
      host: environment.contentful.host,
    }
    logger.debug('Syncer created', params)
    this.contentfulClient = createClient(params)
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
    // TODO: Make the contentful locale reflect the api locale
    // contentful locale does not always reflect the api locale so we need this map
    const contentfulLocaleMap = {
      is: 'is-IS',
      en: 'en',
    }
    const data = await this.contentfulClient.getEntries({
      include: this.defaultIncludeDepth,
      'sys.id[in]': chunkIds,
      locale: contentfulLocaleMap[locale],
    })
    return data.items
  }

  private async getLastSyncToken(
    locale: keyof typeof SearchIndexes,
  ): Promise<string> {
    const query = {
      types: ['cmsNextSyncToken'],
      sort: { dateUpdated: 'desc' as sortDirection },
      size: 1,
    }
    logger.info('Getting next sync token from index', {
      index: SearchIndexes[locale],
    })
    const document = await this.elasticService.getDocumentsByTypes(
      SearchIndexes[locale],
      query,
    )
    return document.hits.hits?.[0]?._source.title
  }

  updateNextSyncToken({ locale, token }: PostSyncOptions) {
    // we get this next sync token from Contentful on sync request
    const nextSyncTokenDocument = {
      title: token,
      type: 'cmsNextSyncToken',
      dateCreated: new Date().getTime().toString(),
      dateUpdated: new Date().getTime().toString(),
    }

    // write sync token to elastic here as it's own type
    logger.info('Writing next sync token to elasticsearch index')
    return this.elasticService.index(
      SearchIndexes[locale],
      nextSyncTokenDocument,
    )
  }

  private async getTypeOfSync({
    fullSync,
    locale,
  }: SyncOptions): Promise<typeOfSync> {
    if (fullSync) {
      // this is a full sync, get all data
      logger.info('Getting all data from Contentful')
      return { initial: true }
    } else {
      // this is a partial sync, try and get the last sync token else do full sync
      const nextSyncToken = await this.getLastSyncToken(locale)
      logger.info('Getting data from last sync token found in Contentful', {
        locale,
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
    const chunkSize = 500
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
        // gets the changes for current locale
        const items = await this.getContentfulData(chunkIds, locale)
        chunkedChanges.push(items)
      }
      chunkToProcess = entries.splice(-chunkSize, chunkSize)
    } while (chunkToProcess.length)

    return _.flatten(chunkedChanges)
  }

  async getSyncEntries({
    fullSync,
    locale,
  }: SyncOptions): Promise<SyncerResult> {
    const typeOfSync = await this.getTypeOfSync({ fullSync, locale })

    // gets all changes in all locales
    const {
      entries,
      nextSyncToken: newNextSyncToken,
      deletedEntries,
    } = await this.getSyncData(typeOfSync)

    logger.info('Sync found entries', {
      entries: entries.length,
      deletedEntries: deletedEntries.length,
    })

    // get all sync entries from Contentful endpoints for this locale, we could parse the sync response into locales but we are opting for this for simplicity
    const items = await this.getAllEntriesFromContentful(entries, locale)

    // extract ids from deletedEntries
    const deletedItems = deletedEntries.map((entry) => entry.sys.id)

    return {
      token: newNextSyncToken,
      items,
      deletedItems,
    }
  }
}
