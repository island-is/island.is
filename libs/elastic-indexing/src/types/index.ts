import { SearchIndexes } from '@island.is/api/content-search';

export interface SyncOptions {
  locale: keyof typeof SearchIndexes
  fullSync: boolean
}

export interface SyncResponse<PostSyncOptionsType = any> {
  add: MappedData[]
  remove: string[],
  postSyncOptions: PostSyncOptionsType
}

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