import {
  ContentfulClientApi,
  createClient,
  CreateClientParams,
  Entry,
  SyncCollection,
} from 'contentful'
import { environment } from '../environments/environment'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'

interface SyncerResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: Entry<any>[]
  deletedItems: string[]
  token: string | undefined
}

@Injectable()
export class Syncer {
  private defaultIncludeDepth = 10
  private contentFulClient: ContentfulClientApi

  constructor() {
    const params: CreateClientParams = {
      space: environment.contentful.space,
      accessToken: environment.contentful.accessToken,
      environment: environment.contentful.environment,
      host: environment.contentful.host,
    }
    logger.debug('Syncer created', params)
    this.contentFulClient = createClient(params)
  }

  private getChunkIds(chunkToProcess: Entry<any>[]): string {
    return chunkToProcess
      .reduce((csvIds, entry) => {
        // if indexing this type is suported
        if (environment.indexableTypes.includes(entry.sys.contentType.sys.id)) {
          csvIds.push(entry.sys.id)
        }
        return csvIds
      }, [])
      .join(',')
  }

  private getContentfulData(chunkIds: string, language: string) {
    const languageMap = {
      'is': 'is-IS',
      'en': 'en'
    }
    // TODO: Make this use cms domain endpoints to reduce mapping/typing required?
    return this.contentFulClient
      .getEntries({
        include: this.defaultIncludeDepth,
        'sys.id[in]': chunkIds,
        locale: languageMap[language]
      })
      .then((data) => data.items)
  }

  // TODO: Limit this request to content types if able e.g. get content type from webhook request
  async getSyncEntries({language, ...opts}): Promise<SyncerResult> {
    const {
      entries,
      nextSyncToken,
      deletedEntries,
    }: SyncCollection = await this.contentFulClient.sync(opts)
    const chunkSize = 30

    logger.info('Sync found entries', {
      entries: entries.length,
      deletedEntries: deletedEntries.length,
    })

    // get all entries form contentful
    let alteredItems = []
    let chunkToProcess = entries.splice(-chunkSize, chunkSize)
    do {
      const chunkIds = this.getChunkIds(chunkToProcess)
      const items = await this.getContentfulData(chunkIds, language)

      alteredItems = [...alteredItems, ...items]
      chunkToProcess = entries.splice(-chunkSize, chunkSize)
    } while (chunkToProcess.length)

    // extract ids from deletedItems
    const deletedItems = deletedEntries.map((entry) => entry.sys.id)

    return {
      items: alteredItems,
      token: nextSyncToken,
      deletedItems,
    }
  }

  async getEntry(id: string): Promise<Entry<unknown> | undefined> {
    return this.contentFulClient.getEntry(id, {
      include: this.defaultIncludeDepth,
    })
  }
}
