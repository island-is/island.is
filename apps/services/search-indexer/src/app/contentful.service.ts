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
export class ContentfulService {
  private defaultIncludeDepth = 10
  private contentfulClient: ContentfulClientApi

  constructor() {
    const params: CreateClientParams = {
      space: environment.contentful.space,
      accessToken: environment.contentful.accessToken,
      environment: environment.contentful.environment,
      host: environment.contentful.host,
    }
    logger.debug('Syncer created', params)
    this.contentfulClient = createClient(params)
  }

  private getChunkIds(chunkToProcess: Entry<any>[], indexableContentTypes: string[]): string {
    return chunkToProcess
      .reduce((csvIds, entry) => {
        // if indexing this type is suported
        if (indexableContentTypes.includes(entry.sys.contentType.sys.id)) {
          csvIds.push(entry.sys.id)
        }
        return csvIds
      }, [])
      .join(',')
  }

  private async getContentfulData(chunkIds: string) {
    logger.info('Getting contentful data')
    const data = await this.contentfulClient
      .getEntries({
        include: this.defaultIncludeDepth,
        'sys.id[in]': chunkIds,
      })
    return data.items
  }

  // TODO: Limit this request to content types if able e.g. get content type from webhook request
  async getSyncEntries({contentTypes, ...opts}): Promise<SyncerResult> {
    const {
      entries,
      nextSyncToken,
      deletedEntries,
    }: SyncCollection = await this.contentfulClient.sync(opts)
    const chunkSize = 100

    logger.info('Sync found entries', {
      entries: entries.length,
      deletedEntries: deletedEntries.length,
    })

    // get all entries from contentful
    let alteredItems = []
    let chunkToProcess = entries.splice(-chunkSize, chunkSize)
    do {
      const chunkIds = this.getChunkIds(chunkToProcess, contentTypes)
      const items = await this.getContentfulData(chunkIds)

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
    return this.contentfulClient.getEntry(id, {
      include: this.defaultIncludeDepth,
    })
  }
}
