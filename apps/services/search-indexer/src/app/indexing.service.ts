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
  constructor(
    private readonly elasticService: ElasticService,
    private readonly contentFulSyncer: Syncer,
  ) {}

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
    logger.info('Start continue sync')
    const {
      items,
      token,
      deletedItems,
    } = await this.contentFulSyncer.getSyncEntries({
      nextSyncToken: syncToken,
      // eslint-disable-next-line @typescript-eslint/camelcase
      resolveLinks: true,
    })

    logger.info('Continue sync is importing', {
      itemCount: items.length,
    })

    for (const item of items) {
      // one at a time please, else ES will be unhappy
      await this.transformAndIndexEntry(index, token, item)
    }

    // delete content that has been unpublished from contentful
    await this.elasticService.deleteByIds(index, deletedItems)

    logger.info('Continue sync done')
  }

  async initialSync(index: SearchIndexes) {
    await this.needConnection()
    logger.info('Start initial sync')
    const { items, token } = await this.contentFulSyncer.getSyncEntries({
      initial: true,
      // eslint-disable-next-line @typescript-eslint/camelcase
      resolveLinks: true,
    })
    logger.info('Initial sync is importing', {
      itemCount: items.length,
    })

    // TODO: Use es client batch here
    for (const item of items) {
      // one at a time please, else ES will be unhappy
      await this.transformAndIndexEntry(index, token, item)
    }

    // delete everything in ES, except for synced content, to ensure no stale data in index
    await this.elasticService.deleteAllExcept(
      index,
      items.map((entry) => entry.sys.id),
    )

    logger.info('Initial sync done')
  }

  async syncById(index: SearchIndexes, id: string) {
    await this.needConnection()
    logger.info('Sync by ID', { id: id })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: Entry<any>
    try {
      result = await this.contentFulSyncer.getEntry(id)
    } catch (e) {
      logger.notice('No entry found')
      return
    }
    logger.info('Sync by ID found entry', {
      resultID: result.sys.id,
    })
    if (result) {
      await this.transformAndIndexEntry(index, null, result)
    }
    logger.info('Sync by ID done')
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
      if (!content) {
        return ''
      }
      let response = ''
      content.forEach((doc) => {
        if (doc.content && doc.content.length) {
          response += reduceContent(doc.content)
        }
        if (doc.data && doc.data.target) {
          if (
            doc.data.target.sys.contentType &&
            doc.data.target.sys.contentType.sys.id === 'processEntry'
          ) {
            response += (doc.data.target.fields.processTitle ?? '') + '\n'
            response += (doc.data.target.fields.processDescription ?? '') + '\n'
          } else {
            //todo implement more typesz
          }
        }
      })
      return response
    }

    // TODO: Fix this when improving mapping
    // related articles has a recursive nesting problem, we prune it for now
    if (entry.fields?.relatedArticles?.[0]?.fields) {
      logger.info('Removing nested related articles from related articles')
      // remove related articles from nested articles
      const {
        relatedArticles,
        ...prunedRelatedArticlesFields
      } = entry.fields.relatedArticles[0].fields
      entry.fields.relatedArticles[0].fields = prunedRelatedArticlesFields
    }

    /* eslint-disable @typescript-eslint/camelcase */
    const document: Document = {
      category: entry.fields?.category?.fields?.title,
      category_slug: entry.fields?.category?.fields?.slug,
      category_description: entry.fields?.category?.fields?.description,
      group: entry.fields?.group?.fields?.title,
      group_slug: entry.fields?.group?.fields?.slug,
      group_description: entry.fields?.group?.fields?.description,
      content: reduceContent(entry.fields.content?.content),
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

// TODO: Setup cron to cleanup the dev environment
