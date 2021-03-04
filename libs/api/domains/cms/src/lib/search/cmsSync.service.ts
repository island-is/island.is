import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import flatten from 'lodash/flatten'
import { hashElement } from 'folder-hash'
import {
  ContentSearchImporter,
  MappedData,
  SyncOptions,
  SyncResponse,
} from '@island.is/content-search-indexer/types'
import { ArticleSyncService } from './importers/article.service'
import { ContentfulService } from './contentful.service'
import { LifeEventsPageSyncService } from './importers/lifeEventsPage.service'
import { ArticleCategorySyncService } from './importers/articleCategory.service'
import { NewsSyncService } from './importers/news.service'
import { AboutPageSyncService } from './importers/aboutPage.service'
import { Entry } from 'contentful'
import { ElasticService } from '@island.is/content-search-toolkit'
import { AdgerdirPageSyncService } from './importers/adgerdirPage'
import { MenuSyncService } from './importers/menu.service'
import { GroupedMenuSyncService } from './importers/groupedMenu.service'
import { getElasticsearchIndex } from '@island.is/content-search-index-manager'
import { SearchResponse } from 'elastic'

export interface PostSyncOptions {
  folderHash: string
  elasticIndex: string
  token: string
}

interface UpdateLastHashOptions {
  elasticIndex: PostSyncOptions['elasticIndex']
  folderHash: PostSyncOptions['folderHash']
}

export type processSyncDataInput<T> = (Entry<any> | T)[]
export interface CmsSyncProvider<T, ProcessOutput = any> {
  processSyncData: (entries: processSyncDataInput<T>) => ProcessOutput
  doMapping: (entries: ProcessOutput) => MappedData[]
}

@Injectable()
export class CmsSyncService implements ContentSearchImporter<PostSyncOptions> {
  private contentSyncProviders: CmsSyncProvider<any>[]
  constructor(
    private readonly aboutPageSyncService: AboutPageSyncService,
    private readonly newsSyncService: NewsSyncService,
    private readonly articleCategorySyncService: ArticleCategorySyncService,
    private readonly articleSyncService: ArticleSyncService,
    private readonly lifeEventsPageSyncService: LifeEventsPageSyncService,
    private readonly adgerdirPageSyncService: AdgerdirPageSyncService,
    private readonly contentfulService: ContentfulService,
    private readonly menuSyncService: MenuSyncService,
    private readonly groupedMenuSyncService: GroupedMenuSyncService,
    private readonly elasticService: ElasticService,
  ) {
    this.contentSyncProviders = [
      this.articleSyncService,
      this.lifeEventsPageSyncService,
      this.articleCategorySyncService,
      this.newsSyncService,
      this.aboutPageSyncService,
      this.adgerdirPageSyncService,
      this.menuSyncService,
      this.groupedMenuSyncService,
    ]
  }

  private async getLastFolderHash(elasticIndex: string): Promise<string> {
    logger.info('Getting folder hash from index', {
      index: elasticIndex,
    })
    // return last folder hash found in elasticsearch else return empty string
    return this.elasticService
      .findById(elasticIndex, 'cmsImportFolderHashId')
      .then((document) => document.body._source.title)
      .catch((error) => {
        // we expect this to throw when this does not exist, this might happen if we reindex a fresh elasticsearch index
        logger.warn('Failed to get last folder hash', {
          error: error.message,
        })
        return ''
      })
  }

  /**
   * We only want to keep one folder hash to have the ability to roll back when restoring old builds
   */
  private async updateLastFolderHash({
    elasticIndex,
    folderHash,
  }: UpdateLastHashOptions) {
    // we get this next sync token from Contentful on sync request
    const folderHashDocument = {
      _id: 'cmsImportFolderHashId',
      title: folderHash,
      type: 'cmsImportFolderHash',
      dateCreated: new Date().getTime().toString(),
      dateUpdated: new Date().getTime().toString(),
    }

    // write sync token to elastic here as it's own type
    logger.info('Writing models hash to elasticsearch index')
    return this.elasticService.index(elasticIndex, folderHashDocument)
  }

  // this will generate different hash when any file has been changed in the importer app
  private async getModelsFolderHash(): Promise<string> {
    // node_modules is quite big, it's unlikely that changes here will effect the cms importers mappings
    const options = { folders: { exclude: ['node_modules'] } }
    const hashResult = await hashElement(__dirname, options)
    return hashResult.hash.toString()
  }

  // this is triggered from ES indexer service
  async doSync(
    options: SyncOptions,
  ): Promise<SyncResponse<PostSyncOptions> | null> {
    logger.info('Doing cms sync', options)
    let cmsSyncOptions: SyncOptions

    /**
     * We don't want full sync to run every time we start a new pod
     * We want full sync to run once when the first pod initializes the first container
     * and then never again until a new index is deployed
     */
    let folderHash
    if (options.syncType === 'initialize') {
      const { elasticIndex = getElasticsearchIndex(options.locale) } = options

      folderHash = await this.getModelsFolderHash()
      const lastFolderHash = await this.getLastFolderHash(elasticIndex)
      if (folderHash !== lastFolderHash) {
        logger.info(
          'Folder and index folder hash do not match, running full sync',
          { locale: options.locale },
        )
        cmsSyncOptions = { ...options, syncType: 'full' }
      } else {
        logger.info('Folder and index folder hash match, skipping sync', {
          locale: options.locale,
        })
        // we skip import if it is not needed
        return null
      }
    } else if (options.syncType === 'full') {
      cmsSyncOptions = options
      folderHash = await this.getModelsFolderHash() // we know full will update all models so we can set the folder hash here
    } else {
      cmsSyncOptions = options
      folderHash = '' // this will always be a partial update so we don't want to update folder hash
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
      (contentSyncProvider) => {
        const data = contentSyncProvider.processSyncData(items)
        return contentSyncProvider.doMapping(data)
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
    // we only want to update folder hash if it is set to a non empty string
    if (folderHash) {
      await this.updateLastFolderHash({ elasticIndex, folderHash })
    }
    return true
  }

  /**
   * Read all documents from an index and write their popularity scores to
   * the documents with corresponding ids in the data array
   *
   * @param {string} index
   * @param {Array<MappedData>} data
   * @return {Array<MappedData>}
   */
  async migratePopularityScores(
    index: string,
    data: Array<MappedData>,
  ): Promise<Array<MappedData>> {
    if (!index) {
      return data
    }
    // TODO: do a scrolling query or sumthin
    const query = {
      query: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        match_all: {},
      },
      size: 10000,
      _source: ['popularityScore'],
    }
    const oldData = await this.elasticService.findByQuery<
      SearchResponse<MappedData>,
      unknown
    >(index, query)

    const oldScores = {}
    oldData.body.hits?.hits.forEach((obj) => {
      oldScores[obj._id] = obj._source.popularityScore
    })

    data.forEach((obj, idx) => {
      if (obj._id in oldScores) {
        data[idx].popularityScore = oldScores[obj._id]
      }
    })

    return data
  }

  /**
   * Returns the name of the most recent island-* index with the given locale,
   * determined by creation date.
   *
   * @param {string} locale
   * @return {string}
   */
  async getLatestIndex(locale: string): Promise<string> {
    const client = await this.elasticService.getClient()

    const indices = await client.cat.indices({
      h: ['i', 'creation.date.string'],
      s: 'creation.date:desc',
    })

    const results = indices.body.match(
      new RegExp(`island-${locale}-[a-z0-9]+`, 'gi'),
    )

    if (results.length < 1) {
      return null
    }
    return results[0]
  }
}
