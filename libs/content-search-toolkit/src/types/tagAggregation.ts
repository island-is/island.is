export interface TagAggregationInput {
  documentTypes: string[]
  tagTypes: string[]
  size?: number
}

export interface TagAggregationResponse {
  group: {
    filtered: {
      doc_count: number
      count: {
        buckets: [
          {
            key: string
            doc_count: number
            value: {
              buckets: [
                {
                  key: string
                  doc_count: number
                },
              ]
            }
            type: {
              buckets: [
                {
                  key: string
                  doc_count: number
                },
              ]
            }
          },
        ]
      }
    }
  }
}
