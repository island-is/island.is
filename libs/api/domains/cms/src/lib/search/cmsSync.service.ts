import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import flatten from 'lodash/flatten'
import { hashElement, HashElementOptions } from 'folder-hash'
import {
  ElasticService,
  MappedData,
  SearchIndexes,
  SyncOptions,
  SyncResponse,
} from '@island.is/api/content-search'
import { ArticleSyncService } from './importers/article.service'
import { ContentfulService } from './contentful.service'
import { LifeEventsPageSyncService } from './importers/lifeEventsPage.service'
import { ArticleCategorySyncService } from './importers/articleCategory.service'
import { NewsSyncService } from './importers/news.service'
import { AboutPageSyncService } from './importers/aboutPage.service'

export interface PostSyncOptions {
  folderHash: string
  elasticIndex: string
  token: string
}

interface UpdateLastHashOptions {
  elasticIndex: PostSyncOptions['elasticIndex']
  folderHash: PostSyncOptions['folderHash']
}

@Injectable()
export class CmsSyncService {
  private contentSyncProviders
  constructor(
    private readonly aboutPageSyncService: AboutPageSyncService,
    private readonly newsSyncService: NewsSyncService,
    private readonly articleCategorySyncService: ArticleCategorySyncService,
    private readonly articleSyncService: ArticleSyncService,
    private readonly lifeEventsPageSyncService: LifeEventsPageSyncService,
    private readonly contentfulService: ContentfulService,
    private readonly elasticService: ElasticService,
  ) {
    this.contentSyncProviders = [
      this.articleSyncService,
      this.lifeEventsPageSyncService,
      this.articleCategorySyncService,
      this.newsSyncService,
      this.aboutPageSyncService,
    ]
  }

  private async getLastFolderHash(elasticIndex: string): Promise<string> {
    logger.info('Getting models hash from index', {
      index: elasticIndex,
    })
    // return last folder hash found in elasticsearch else return empty string
    return this.elasticService.findById(
      elasticIndex,
      'cmsImportFolderHashId',
    )
      .then((document) => document.body._source.title)
      .catch((error) => {
        logger.error('Failed to get last folder hash', { error: error.message })
        return ''
      })
  }

  private async updateLastFolderHash({ elasticIndex, folderHash }: UpdateLastHashOptions) {
    // we get this next sync token from Contentful on sync request
    const nextSyncTokenDocument: MappedData = {
      _id: 'cmsImportFolderHashId',
      title: folderHash,
      type: 'cmsImportModelsFolderHash',
      dateCreated: new Date().getTime().toString(),
      dateUpdated: new Date().getTime().toString(),
    }

    // write sync token to elastic here as it's own type
    logger.info('Writing models hash to elasticsearch index')
    return this.elasticService.index(elasticIndex, nextSyncTokenDocument)
  }

  // this will generate diffrent hash for each build
  private async getModelsFolderHash(): Promise<string> {
    const hashResult = await hashElement(__dirname)
    return hashResult.hash.toString()
  }

  // this is triggered from ES indexer service
  async doSync(options: SyncOptions): Promise<SyncResponse<PostSyncOptions>> {
    logger.info('Doing cms sync', options)
    let cmsSyncOptions: SyncOptions

    /**
     * We don't want full sync to run every time we start a new pod
     * We want full sync to run once when the first pod initializes the first container
     * and the never again until a new build is deployed
    */
    let folderHash
    if (options.syncType === 'initialize') {
      // TODO: Add lock to this procedure to ensure only a single initContainer can run this
      const {
        elasticIndex = SearchIndexes[options.locale]
      } = options
      folderHash = await this.getModelsFolderHash()
      const lastFolderHash = await this.getLastFolderHash(elasticIndex)

      logger.info('Hashes response', { folderHash, lastFolderHash })

      if (folderHash !== lastFolderHash) {
        cmsSyncOptions = { ...options, syncType: 'full' }
      } else {
        // we skip import if it is not needed
        return null
      }
    } else {
      cmsSyncOptions = options
    }

    // gets all data that needs importing
    const {
      items,
      deletedItems,
      token,
      elasticIndex,
    } = await this.contentfulService.getSyncEntries(cmsSyncOptions)
    logger.info('Got sync data')

    // import data from all providers
    const importableData = this.contentSyncProviders.map(
      ({ processSyncData, doMapping }) => {
        const data = processSyncData(items)

        return doMapping(data)
      },
    )

    return {
      add: flatten(importableData),
      remove: deletedItems,
      postSyncOptions: {
        folderHash,
        elasticIndex,
        token,
      },
    }
  }

  // write next sync token to elastic after sync to ensure it runs again on failure
  async postSync({ folderHash, elasticIndex, token }: PostSyncOptions) {
    await this.contentfulService.updateNextSyncToken({ elasticIndex, token })
    await this.updateLastFolderHash({ elasticIndex, folderHash })
    return true
  }
}

// TODO: Make nextSyncToken use same method of keeping keys as lastFolderHash
