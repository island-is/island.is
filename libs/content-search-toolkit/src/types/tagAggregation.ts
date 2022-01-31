import { SearchableTags } from '@island.is/api/schema'

export interface TagAggregationInput {
  documentTypes: string[]
  tagTypes: SearchableTags[]
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
          },
        ]
      }
    }
  }
}
