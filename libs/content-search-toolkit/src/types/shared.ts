import { MappedData } from '@island.is/content-search-indexer/types'
import { registerEnumType } from '@nestjs/graphql'

export enum SortDirection {
  DESC = 'desc',
  ASC = 'asc',
}

export enum SortField {
  TITLE = 'title',
  POPULAR = 'popular',
}

export type elasticTagField = {
  key: string
  type: string
  value?: string
}

export interface SyncRequest {
  add: MappedData[]
  remove: string[]
}

registerEnumType(SortDirection, { name: 'SortDirection' })
registerEnumType(SortField, { name: 'SortField' })
