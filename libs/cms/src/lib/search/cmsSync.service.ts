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
import { ContentfulService } from './contentful.service'
import { Entry } from 'contentful'
import { ElasticService, SearchInput } from '@island.is/content-search-toolkit'
import { getElasticsearchIndex } from '@island.is/content-search-index-manager'
import { MappingService } from './mapping.service'

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
  processSyncData: (entries: processSyncDataInput<T>) => {
    entriesToUpdate: ProcessOutput
    entriesToDelete: string[]
  }
  doMapping: (entries: ProcessOutput) => MappedData[]
}

@Injectable()
export class CmsSyncService implements ContentSearchImporter<PostSyncOptions> {
  constructor(
    private readonly contentfulService: ContentfulService,
    private readonly mappingService: MappingService,
    private readonly elasticService: ElasticService,
  ) {}

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

  async getNextSyncToken(syncType: SyncOptions['syncType']) {
    if (syncType === 'fromLast') {
      return ''
    }

    let nextPageToken: string | undefined = ''
    let nextSyncToken = ''

    // We don't get the next sync token until we've reached the last page
    while (!nextSyncToken) {
      const response = await this.contentfulService.getSyncData({
        initial: true,
        nextPageToken,
      })
      nextPageToken = response.nextPageToken
      nextSyncToken = response.nextSyncToken
    }
    return nextSyncToken
  }

  // this is triggered from ES indexer service
  async doSync(
    options: SyncOptions,
  ): Promise<SyncResponse<PostSyncOptions> | null> {
    logger.info('Doing cms sync', options)
    let cmsSyncOptions: SyncOptions = options

    /**
     * We don't want full sync to run every time we start a new pod
     * We want full sync to run once when the first pod initializes the first container
     * and then never again until a new index is deployed
     */
    let folderHash = options.folderHash

    if (options.syncType === 'initialize') {
      const { elasticIndex = getElasticsearchIndex(options.locale) } = options
      cmsSyncOptions = { ...options, syncType: 'full' }
      if (folderHash === undefined) {
        folderHash = await this.getModelsFolderHash()
        const lastFolderHash = await this.getLastFolderHash(elasticIndex)
        if (folderHash !== lastFolderHash) {
          logger.info(
            'Folder and index folder hash do not match, running full sync',
            { locale: options.locale },
          )
        } else {
          logger.info('Folder and index folder hash match, skipping sync', {
            locale: options.locale,
          })
          // we skip import if it is not needed
          return null
        }
      }
    } else if (options.syncType === 'full') {
      cmsSyncOptions = options
      if (folderHash === undefined) {
        folderHash = await this.getModelsFolderHash() // we know full will update all models so we can set the folder hash here
      }
    } else {
      cmsSyncOptions = options
      folderHash = '' // this will always be a partial update so we don't want to update folder hash
    }

    // gets all data that needs importing
    const { items, deletedEntryIds, token, elasticIndex, nextPageToken } =
      await this.contentfulService.getSyncEntries(cmsSyncOptions)
    logger.info('Got sync data')

    // import data from all providers
    const { mappedData: importableData, entriesToDelete } =
      this.mappingService.mapData(items)

    return {
      add: flatten(importableData),
      remove: deletedEntryIds.concat(entriesToDelete),
      postSyncOptions: {
        folderHash,
        elasticIndex,
        token,
      },
      nextPageToken,
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

  private async fetchIdsFromElasticsearch(
    elasticIndex: string,
    types: SearchInput['types'],
    tags: SearchInput['tags'],
  ) {
    const ids: string[] = []
    let shouldContinueFetching = true
    let page = 1

    while (shouldContinueFetching) {
      const response = await this.elasticService.search(elasticIndex, {
        queryString: '*',
        types,
        tags,
        page,
      })

      const responseItems = response?.body?.hits?.hits ?? []

      for (const item of responseItems) {
        ids.push(item._id)
      }

      shouldContinueFetching = responseItems.length > 0
      page += 1
    }

    return ids
  }

  async handleDocumentDeletion(
    elasticIndex: string,
    document: Pick<Entry<unknown>, 'sys'>,
  ) {
    // If we're gonna delete a 'manual' or 'manualChapter' from ElasticSearch then we need to also delete all manualChapterItems that it references
    if (
      document.sys.contentType.sys.id === 'manual' ||
      document.sys.contentType.sys.id === 'manualChapter'
    ) {
      const manualChapterItemIds = await this.fetchIdsFromElasticsearch(
        elasticIndex,
        ['webManualChapterItem'],
        [{ key: document.sys.id, type: 'referencedBy' }],
      )

      return this.elasticService.deleteByIds(
        elasticIndex,
        [document.sys.id].concat(manualChapterItemIds),
      )
    }

    // If we're gonna delete an 'article' from ElasticSearch then we need to also delete all subArticles that are have a parent field that points to this article
    if (document.sys.contentType.sys.id === 'article') {
      const subArticles = await this.contentfulService.getContentfulData(100, {
        content_type: 'subArticle',
        'fields.parent.sys.id': document.sys.id,
      })

      return this.elasticService.deleteByIds(
        elasticIndex,
        [document.sys.id].concat(subArticles.map((s) => s.sys.id)),
      )
    }

    // If a generic list gets deleted then all of its items should also be deleted
    if (document.sys.contentType.sys.id === 'genericList') {
      const listItems = await this.contentfulService.getContentfulData(100, {
        content_type: 'genericListItem',
        'fields.genericList.sys.id': document.sys.id,
      })

      return this.elasticService.deleteByIds(
        elasticIndex,
        [document.sys.id].concat(listItems.map((i) => i.sys.id)),
      )
    }

    // If a custom page gets deleted make sure all of its subpages are also deleted
    if (document.sys.contentType.sys.id === 'customPage') {
      const subpageIds = await this.fetchIdsFromElasticsearch(
        elasticIndex,
        ['webCustomPage'],
        [
          {
            key: document.sys.id,
            type: 'referencedBy',
          },
        ],
      )

      return this.elasticService.deleteByIds(
        elasticIndex,
        [document.sys.id].concat(subpageIds),
      )
    }

    return this.elasticService.deleteByIds(elasticIndex, [document.sys.id])
  }
}
