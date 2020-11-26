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
