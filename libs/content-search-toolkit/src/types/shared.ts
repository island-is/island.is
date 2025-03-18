import { MappedData } from '@island.is/content-search-indexer/types'
import { registerEnumType } from '@nestjs/graphql'

export enum SortDirection {
  DESC = 'desc',
  ASC = 'asc',
}

export enum SortField {
  TITLE = 'title',
  POPULAR = 'popular',
  RELEASE_DATE = 'releaseDate',
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

export type sortableFields =
  | 'dateUpdated'
  | 'dateCreated'
  | 'title.sort'
  | 'popularityScore'
  | 'releaseDate'
  | '_score'

export type sortRule = {
  [key in sortableFields]?: {
    order: SortDirection
  }
}
registerEnumType(SortDirection, { name: 'SortDirection' })
registerEnumType(SortField, { name: 'SortField' })
