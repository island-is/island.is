export interface DateAggregationInput {
  types: string[]
  field?: string
}

type aggregationResult = {
  key_as_string: string,
  key: number,
  doc_count: number
}

export interface DateAggregationResponse {
  dates: {
    buckets: aggregationResult[]
  }
}

export const dateAggregationQuery = ({
  types = [],
  field = 'dateCreated'
}: DateAggregationInput) => {


  const query = {
    query: {
      terms: {
        type: types,
      }
    },
    aggs: {
      years: {
        date_histogram: {
          calendar_interval: '1M',
          format: 'yyyy-MM',
          field
        }
      }
    }
  }

  return query
}
