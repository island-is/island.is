import { Injectable } from '@nestjs/common'
import {
  Document,
  ElasticService,
  SearchIndexes,
} from '@island.is/api/content-search'
import { Entry } from 'contentful'
import _ from 'lodash'
import { ContentfulService } from './contentful.service'
import { logger } from '@island.is/logging'
import { CmsSyncService } from './cmsSync.service'

export interface SyncOptions {
  locale: keyof typeof SearchIndexes
  fullSync: boolean
}

export interface SyncResponse<T> {
  add: T[]
  remove: string[]
}
@Injectable()
export class IndexingService {
  constructor(
    private readonly elasticService: ElasticService,
    private readonly contentFulSyncer: ContentfulService,
    private readonly cmsSyncService: CmsSyncService,
  ) { }

  // await this.elasticService.deleteByIds(index, deletedItems)
  async doSync(options: SyncOptions) {
    const cmsData = await this.cmsSyncService.doSync(options)
    logger.info('deleting entries from index')
    await this.elasticService.deleteByIds(SearchIndexes[options.locale], cmsData.remove)
    logger.info('adding entries to index', cmsData.add[0])
    await this.elasticService.bulk(SearchIndexes[options.locale], cmsData.add)
    logger.info('Done with sync')
    return true
  }









  async indexDocument(index: SearchIndexes, document) {
    return this.elasticService.index(index, document)
  }

  private createTerms(termStrings: string[]): string[] {
    const maxConsecutiveWordCount = 4
    const singleWords = termStrings.map((termString = '') => {
      const words = termString.toLowerCase()
        .replace(/[^a-záðéíúýþæö]+/g, ' ') // remove all non characters
        .split(/\s+/)

      for (let i = 2; i === maxConsecutiveWordCount; i++) {
        words.push(singleWords.slice(0, i).join(' '))
      }
      return words
    })
    return _.flatten(singleWords)
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
            response += (doc.data.target.fields.processInfo ?? '') + '\n'
          } else {
            //todo implement more types
          }
        }
      })
      return response
    }

    // TODO: Fix this when improving mapping
    // related articles has a recursive nesting problem, we prune it for now
    if (entry.fields?.relatedArticles?.[0]?.fields) {
      entry.fields.relatedArticles = entry.fields.relatedArticles.map(
        (relatedArticle) => {
          // remove related articles from nested articles
          const {
            relatedArticles,
            ...prunedRelatedArticlesFields
          } = relatedArticle.fields

          return { fields: prunedRelatedArticlesFields }
        },
      )
    }

    /* eslint-disable @typescript-eslint/camelcase */
    const document: Document = {
      category: entry.fields?.category?.fields?.title,
      category_slug: entry.fields?.category?.fields?.slug,
      category_description: entry.fields?.category?.fields?.description,
      group: entry.fields?.group?.fields?.title,
      group_slug: entry.fields?.group?.fields?.slug,
      group_description: entry.fields?.group?.fields?.description,
      subgroup: entry.fields?.subgroup?.fields?.title,
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
      term_pool: [],
      _id: entry.sys.id,
    }

    // provide clean terms for e.g. autocomplete words
    document.term_pool = this.createTerms([
      document.title,
      document.category,
      document.group
    ])

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

// TODO: Create an import module used by this app.module that provides all providers and a map to find the correct provider for a given task
// TODO: Make indexer get data functions from selected domains, may export them as nest modules?
// TODO: Make indexer not know how to get data and how to map data
// TODO: Find a solution to sync problem, maybe a function that returns ids passed to get data