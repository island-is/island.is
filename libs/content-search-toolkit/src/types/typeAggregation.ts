export interface TypeAggregationInput {
  size?: number
}

export interface TypeAggregationResponse {
  typeCount: {
    buckets: [
      {
        key: string
        doc_count: number
      },
    ]
  }
}
