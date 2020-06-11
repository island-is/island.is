import {
  createClient,
  ContentfulClientApi,
  SyncCollection,
  Entry,
} from 'contentful'
import { environment } from '../environments/environment'

interface SyncerResult {
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

export class Syncer {
  private contentFulClient: ContentfulClientApi
  constructor() {
    this.contentFulClient = createClient(environment.contentful)
  }

  async getSyncEntries(opts): Promise<SyncerResult> {
    const collection: SyncCollection = await this.contentFulClient.sync(opts)
    const idChunks = chunk(
      collection.entries.map((entry) => entry.sys.id),
      30,
    )
    const result = {
      items: [],
      token: collection.nextSyncToken,
    }
    for (const ids of idChunks) {
      const { items } = await this.contentFulClient.getEntries({
        'sys.id[in]': ids.join(','),
      })
      result.items = result.items.concat(items)
    }
    return result
  }
}
