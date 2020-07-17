import { Injectable } from '@nestjs/common'
import {
  Document,
  ElasticService,
  SearchIndexes,
} from '@island.is/api/content-search'
import { ExistsQuery, RequestBodySearch, Sort } from 'elastic-builder'
import { Entry } from 'contentful'
import { Syncer } from '../contentful/syncer'
import { logger } from '@island.is/logging'

@Injectable()
export class IndexingService {
  private elasticService: ElasticService
  private contentFulSyncer: Syncer

  constructor() {
    // todo replace with di
    this.elasticService = new ElasticService()
    this.contentFulSyncer = new Syncer()
  }

  async indexDocument(index: SearchIndexes, document) {
    return this.elasticService.index(index, document)
  }

  async getLastSyncToken(index: SearchIndexes): Promise<string | undefined> {
    const query = new RequestBodySearch()
      .query(new ExistsQuery('nextSyncToken'))
      .sort(new Sort('date_updated', 'desc'))
      .size(1)
    try {
      const result = await this.elasticService.findByQuery(index, query)
      return result.body?.hits?.hits[0]?._source?.nextSyncToken
    } catch (e) {
      logger.error('Could not fetch last sync token', {
        error: e,
      })
      return undefined
    }
  }

  async continueSync(syncToken: string, index: SearchIndexes) {
    await this.needConnection()
    logger.debug('Start continue sync')
    const result = await this.contentFulSyncer.getSyncEntries({
      nextSyncToken: syncToken,
      // eslint-disable-next-line @typescript-eslint/camelcase
      content_type: 'article',
      resolveLinks: true,
    })
    logger.debug('Continue sync found results', {
      numItems: result.items.length,
    })
    for (const item of result.items) {
      // one at a time please, else ES will be unhappy
      await this.transformAndIndexEntry(index, result.token, item)
    }
    logger.debug('Continue sync done')
  }

  async initialSync(index: SearchIndexes) {
    await this.needConnection()
    logger.debug('Start initial sync')
    const result = await this.contentFulSyncer.getSyncEntries({
      initial: true,
      // eslint-disable-next-line @typescript-eslint/camelcase
      content_type: 'article',
      resolveLinks: true,
    })
    logger.debug('Initial sync found result', {
      numItems: result.items.length,
    })

    for (const item of result.items) {
      // one at a time please, else ES will be unhappy
      await this.transformAndIndexEntry(index, result.token, item)
    }

    logger.debug('Initial sync done')
  }

  async syncById(index: SearchIndexes, id: string) {
    await this.needConnection()
    logger.debug('Sync by ID', { id: id })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: Entry<any>
    try {
      result = await this.contentFulSyncer.getEntry(id)
    } catch (e) {
      logger.info('No entry found')
      return
    }
    logger.debug('Sync by ID found entry', {
      resultID: result.sys.id,
    })
    if (result) {
      await this.transformAndIndexEntry(index, null, result)
    }
    logger.debug('Sync by ID done')
  }

  async ping() {
    return this.elasticService.ping()
  }

  private async transformAndIndexEntry(
    index: SearchIndexes,
    syncToken: string | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    entry: Entry<any>,
  ) {
    function reduceContent(content) {
      let response = ''
      content.forEach((doc) => {
        if (doc.content && doc.content.length) {
          response += reduceContent(doc.content)
        }
        if (doc.data && doc.data.target) {
          if (doc.data.target.sys.contentType.sys.id === 'processEntry') {
            response += doc.data.target.fields.processTitle + '\n'
            response += doc.data.target.fields.processDescription + '\n'
          } else {
            //todo implement more types
          }
        }
      })
      return response
    }

    /* eslint-disable @typescript-eslint/camelcase */
    const document: Document = {
      category: entry.fields?.category?.fields.title,
      category_slug: entry.fields?.category?.fields.slug,
      group: entry.fields?.group?.fields.title,
      group_slug: entry.fields?.group?.fields.slug,
      content: reduceContent(entry.fields.content.content),
      content_blob: JSON.stringify(entry.fields),
      content_id: entry.sys.id,
      content_source: '',
      content_type: entry.sys.contentType.sys.id,
      date: entry.sys.createdAt,
      date_updated: new Date(),
      image: '',
      image_text: '',
      lang: entry.sys.locale,
      slug: entry.fields.slug,
      tag: [''],
      title: entry.fields.title,
      url: '',
      _category: {
        title: entry.fields?.category?.fields.title,
        slug: entry.fields?.category?.fields.slug,
        description: entry.fields?.category?.fields.description,
      },
      _id: entry.sys.id,
    }
    if (syncToken) {
      document.nextSyncToken = syncToken
    }

    await this.elasticService.index(index, document)
  }

  private async needConnection() {
    await this.elasticService.ping().catch((e) => {
      ElasticService.handleError('Indexer does not have connection', {}, e)
    })
  }
}
