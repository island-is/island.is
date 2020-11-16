export * from './document'

export type sortDirection = 'desc' | 'asc'

export type sortableFields = {
  dateUpdated?: sortDirection
  dateCreated?: sortDirection
  'title.sort'?: sortDirection
}

export type elasticTagField = {
  key: string
  type: string
  value?: string
}

export type dateResolution = 'year' | 'month' | 'week' | 'day'

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
