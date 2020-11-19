import { elasticTagField } from './shared'

export interface DateAggregationInput {
  types: string[]
  field?: string
  resolution?: dateResolution
  order?: 'desc' | 'asc'
  tags?: elasticTagField[]
}

type aggregationResult = {
  key_as_string: string
  key: number
  doc_count: number
}

export interface DateAggregationResponse {
  dates: {
    buckets: aggregationResult[]
  }
}

export type dateResolution = 'year' | 'month' | 'week' | 'day'
