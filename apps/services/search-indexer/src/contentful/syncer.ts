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
  token: string | undefined
}

function chunk(arr, len) {
  let i = 0
  const chunks = [],
    n = arr.length

  while (i < n) {
    chunks.push(arr.slice(i, (i += len)))
  }
  return chunks
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
    const collection: SyncCollection = await this.contentFulClient.sync(opts)

    logger.info('Entire collection', { collection: collection })
    logger.info('Deleted entries', { deleted: collection.deletedEntries })
    const idChunks = chunk(
      collection.entries.map((entry) => entry.sys.id),
      30,
    )
    const result = {
      items: [],
      deletedItems: [],
      token: collection.nextSyncToken,
    }
    for (const ids of idChunks) {
      const { items } = await this.contentFulClient.getEntries({
        include: this.defaultIncludeDepth,
        'sys.id[in]': ids.join(','),
      })
      result.items = result.items.concat(items)
    }
    return result
  }

  async getEntry(id: string): Promise<Entry<unknown> | undefined> {
    return this.contentFulClient.getEntry(id, {
      include: this.defaultIncludeDepth,
    })
  }
}
