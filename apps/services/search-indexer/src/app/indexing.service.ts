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
    } catch {
      return undefined
    }
  }

  async continueSync(syncToken: string, index: SearchIndexes) {
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
    result.items.forEach(
      this.transformAndIndexEntry.bind(this, index, result.token),
    )
    logger.debug('Continue sync done')
  }

  async initialSync(index: SearchIndexes) {
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
    result.items.forEach(
      this.transformAndIndexEntry.bind(this, index, result.token),
    )

    logger.debug('Initial sync done')
  }

  async syncById(index: SearchIndexes, id: string) {
    logger.debug('Sync by ID', { id: id })
    let result
    try {
      result = await this.contentFulSyncer.getEntry(id)
    } catch (e) {
      logger.info('No entry found')
      return
    }
    logger.debug('Sync by ID found entry', {
      result: result.id,
    })
    if (result) {
      await this.transformAndIndexEntry.bind(this, index, result)
    }
    logger.debug('Sync by ID done')
  }

  private async transformAndIndexEntry(
    index: SearchIndexes,
    syncToken: string,
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
      nextSyncToken: syncToken,
    }

    try {
      await this.elasticService.index(index, document)
    } catch (e) {
      logger.error('Error indexing', {
        e: e,
        id: document._id,
      })
    }
  }
}
