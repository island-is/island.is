import { MappedData } from '@island.is/content-search-indexer/types'

export type sortDirection = 'desc' | 'asc'

export type elasticTagField = {
  key: string
  type: string
  value?: string
}

export interface SyncRequest {
  add: MappedData[]
  remove: string[]
}

export * from './autocomplete'
export * from './search'
export * from './documentByMetaData'
export * from './dateAggregation'
export * from './tagAggregation'
