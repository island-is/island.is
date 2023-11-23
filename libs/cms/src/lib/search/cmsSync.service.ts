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
import { SubArticleSyncService } from './importers/subArticle.service'
import { ContentfulService } from './contentful.service'
import { AnchorPageSyncService } from './importers/anchorPage.service'
import { ArticleCategorySyncService } from './importers/articleCategory.service'
import { NewsSyncService } from './importers/news.service'
import { Entry } from 'contentful'
import { ElasticService } from '@island.is/content-search-toolkit'
import { AdgerdirPageSyncService } from './importers/adgerdirPage'
import { MenuSyncService } from './importers/menu.service'
import { GroupedMenuSyncService } from './importers/groupedMenu.service'
import { getElasticsearchIndex } from '@island.is/content-search-index-manager'
import { OrganizationPageSyncService } from './importers/organizationPage.service'
import { OrganizationSubpageSyncService } from './importers/organizationSubpage.service'
import { FrontpageSyncService } from './importers/frontpage.service'
import { SupportQNASyncService } from './importers/supportQNA.service'
import { LinkSyncService } from './importers/link.service'
import { ProjectPageSyncService } from './importers/projectPage.service'
import { EnhancedAssetSyncService } from './importers/enhancedAsset.service'
import { VacancySyncService } from './importers/vacancy.service'
import { ServiceWebPageSyncService } from './importers/serviceWebPage.service'
import { EventSyncService } from './importers/event.service'
import { ManualSyncService } from './importers/manual.service'

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
    private readonly newsSyncService: NewsSyncService,
    private readonly articleCategorySyncService: ArticleCategorySyncService,
    private readonly articleSyncService: ArticleSyncService,
    private readonly subArticleSyncService: SubArticleSyncService,
    private readonly anchorPageSyncService: AnchorPageSyncService,
    private readonly adgerdirPageSyncService: AdgerdirPageSyncService,
    private readonly contentfulService: ContentfulService,
    private readonly menuSyncService: MenuSyncService,
    private readonly groupedMenuSyncService: GroupedMenuSyncService,
    private readonly organizationPageSyncService: OrganizationPageSyncService,
    private readonly organizationSubpageSyncService: OrganizationSubpageSyncService,
    private readonly projectPageSyncService: ProjectPageSyncService,
    private readonly frontpageSyncService: FrontpageSyncService,
    private readonly supportQNASyncService: SupportQNASyncService,
    private readonly linkSyncService: LinkSyncService,
    private readonly enhancedAssetService: EnhancedAssetSyncService,
    private readonly elasticService: ElasticService,
    private readonly vacancyService: VacancySyncService,
    private readonly serviceWebPageSyncService: ServiceWebPageSyncService,
    private readonly eventSyncService: EventSyncService,
    private readonly manualSyncService: ManualSyncService,
  ) {
    this.contentSyncProviders = [
      this.articleSyncService,
      this.subArticleSyncService,
      this.anchorPageSyncService,
      this.articleCategorySyncService,
      this.newsSyncService,
      this.adgerdirPageSyncService,
      this.menuSyncService,
      this.groupedMenuSyncService,
      this.organizationPageSyncService,
      this.organizationSubpageSyncService,
      this.projectPageSyncService,
      this.frontpageSyncService,
      this.supportQNASyncService,
      this.linkSyncService,
      this.enhancedAssetService,
      this.vacancyService,
      this.serviceWebPageSyncService,
      this.eventSyncService,
      this.manualSyncService,
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
    const { items, deletedEntryIds, token, elasticIndex } =
      await this.contentfulService.getSyncEntries(cmsSyncOptions)
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
      remove: deletedEntryIds,
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

  async handleDocumentDeletion(
    elasticIndex: string,
    document: Pick<Entry<unknown>, 'sys'>,
  ) {
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

    return this.elasticService.deleteByIds(elasticIndex, [document.sys.id])
  }
}
