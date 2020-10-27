export * from './document'

export type sortDirection = 'desc' | 'asc'

export type sortableFields = {
  dateUpdated?: sortDirection
  dateCreated?: sortDirection
  'title.sort'?: sortDirection
}

export enum SearchIndexes {
  'is' = 'island-is',
  'en' = 'island-en',
}

export type elasticTagField = {
  key: string
  type: string
  value?: string
}

export interface SyncOptions {
  locale: keyof typeof SearchIndexes
  fullSync: boolean
  elasticIndex?: string
}

export interface SyncResponse<PostSyncOptionsType = any> {
  add: MappedData[]
  remove: string[]
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

export type dateResolution = 'year' | 'month' | 'week' | 'day'
