export * from './document'

export type sortDirection = 'desc' | 'asc'

export type sortableFields = {
  dateUpdated?: sortDirection
  dateCreated?: sortDirection
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

interface ShardsResponse {
  total: number
  successful: number
  failed: number
  skipped: number
}

interface Explanation {
  value: number
  description: string
  details: Explanation[]
}

export interface SearchResponse<T> {
  took: number
  timed_out: boolean
  _scroll_id?: string
  _shards: ShardsResponse
  hits: {
    total: {
      value: number
      relation: string
    }
    max_score: number
    hits: Array<{
      _index: string
      _type: string
      _id: string
      _score: number
      _source: T
      _version?: number
      _explanation?: Explanation
      fields?: any
      highlight?: any
      inner_hits?: any
      matched_queries?: string[]
      sort?: string[]
    }>
  }
  aggregations?: any
}
