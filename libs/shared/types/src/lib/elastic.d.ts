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

export interface SearchResponse<ResponseSource, ResponseAggregation = any> {
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
      _source: ResponseSource
      _version?: number
      _explanation?: Explanation
      fields?: any
      highlight?: any
      inner_hits?: any
      matched_queries?: string[]
      sort?: string[]
    }>
  }
  aggregations?: ResponseAggregation
}

export interface GetByIdResponse<ResponseSource = any> {
  _index: SearchIndex
  _type: string
  _id: string
  _version: number
  _seq_no: number
  _primary_term: number
  found: boolean
  _source: ResponseSource
}
