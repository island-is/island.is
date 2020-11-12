import { SearchIndexes } from '@island.is/api/content-search'

type tag = {
  key: string
  value?: string
  type: string
}
export interface MappedData {
  _id?: string
  title: string
  content?: string
  type: string
  termPool?: string[]
  response?: string
  tags?: tag[]
  dateUpdated: string
  dateCreated: string
  nextSyncToken?: string
}

export interface SyncOptions {
  locale: keyof typeof SearchIndexes
  syncType: 'full' | 'fromLast' | 'initialize'
  elasticIndex?: string
}

export interface SyncResponse<PostSyncOptionsType = any> {
  add: MappedData[]
  remove: string[]
  postSyncOptions: PostSyncOptionsType
}

export interface ContentSearchImporter<postSyncOptions = any> {
  doSync: (options: SyncOptions) => Promise<SyncResponse<postSyncOptions>>
  postSync: (options: postSyncOptions) => Promise<boolean>
}
