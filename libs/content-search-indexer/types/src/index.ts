import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'

type tag = {
  key: string
  value?: string
  type: string
}

export interface MappedData {
  _id?: string
  title: string
  content?: string
  contentWordCount?: number
  processEntryCount?: number
  fillAndSignLinks?: number
  pdfLinks?: number
  wordLinks?: number
  externalLinks?: number
  popularityScore?: number
  type: string
  termPool?: string[]
  response?: string
  tags?: tag[]
  dateUpdated: string
  dateCreated: string
  releaseDate?: string | null
}

export interface SyncOptions {
  locale: ElasticsearchIndexLocale
  syncType: 'full' | 'fromLast' | 'initialize'
  elasticIndex?: string
  nextPageToken?: string
}

export interface SyncResponse<PostSyncOptionsType = any> {
  add: MappedData[]
  remove: string[]
  postSyncOptions?: PostSyncOptionsType
  nextPageToken?: string
}

export interface ContentSearchImporter<postSyncOptions = any> {
  doSync: (
    options: SyncOptions,
  ) => Promise<SyncResponse<postSyncOptions> | null>
  postSync?: (options: postSyncOptions) => Promise<boolean>
}

type KibanaType = 'visualization' | 'index-pattern' | 'dashboard'

interface BaseKibanaSavedObject {
  id: string
  type: KibanaType
  attributes: {
    title: string
  }
}

export interface KibanaSavedObject extends BaseKibanaSavedObject {
  updated_at: string
  version: string
}

export interface LocalKibanaSavedObject extends BaseKibanaSavedObject {
  nestedJsonPaths: string[]
}
