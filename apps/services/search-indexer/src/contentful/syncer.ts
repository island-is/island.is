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

  async getSyncEntries(opts): Promise<SyncerResult> {
    const {
      entries,
      nextSyncToken,
      deletedEntries,
    }: SyncCollection = await this.contentFulClient.sync(opts)
    const chunkSize = 30

    // get all entries form contentful
    let alteredItems = []
    let chunkToProcess = entries.splice(-chunkSize, chunkSize)
    do {
      const chunkIds = chunkToProcess.reduce((csvIds, entry) => {
        // if indexing this type is suported
        if (environment.indexableTypes.includes(entry.sys.contentType.sys.id)) {
          return `${csvIds}, ${entry.sys.id}`
        } else {
          return csvIds
        }
      }, '')

      // TODO: Make this use cms domain endpoints to reduce mapping/typing required?
      const { items } = await this.contentFulClient.getEntries({
        include: this.defaultIncludeDepth,
        'sys.id[in]': chunkIds,
      })
      alteredItems = alteredItems.concat(items)
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
