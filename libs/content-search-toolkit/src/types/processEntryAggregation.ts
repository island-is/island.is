export interface ProcessEntryAggregationResponse {
  processEntryCount: {
    buckets: [
      {
        key: number
        doc_count: number
      },
    ]
  }
}
