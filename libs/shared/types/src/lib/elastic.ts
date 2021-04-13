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
  _index: string
  _type: string
  _id: string
  _version: number
  _seq_no: number
  _primary_term: number
  found: boolean
  _source: ResponseSource
}

export interface RankEvaluationResponse<searchTermsUnion extends string> {
  metric_score: number
  details: {
    [searchTerm in searchTermsUnion]: {
      metric_score: number
      unrated_docs: [
        {
          _index: string
          _id: string
        },
      ]
      hits: [
        {
          hit: {
            _index: string
            _type: string
            _id: string
            _score: number
          }
          rating: number
        },
      ]
      metric_details:
        | {
            dcg: {
              dcg: number
              ideal_dcg: number
              normalized_dcg: number
              unrated_docs: number
            }
          }
        | {
            precision: {
              relevant_docs_retrieved: number
              docs_retrieved: number
            }
          }
    }
  }
  failures: {}
}

export interface DeleteByQueryResponse {
  took: number
  timed_out: boolean
  total: number
  deleted: number
  batches: number
  version_conflicts: number
  noops: number
  retries: {
    bulk: number
    search: number
  }
  throttled_millis: number
  requests_per_second: number
  throttled_until_millis: number
  failures: any[]
}
