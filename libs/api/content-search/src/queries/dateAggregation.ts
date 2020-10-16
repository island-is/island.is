import { dateResolution } from '../types'

export interface DateAggregationInput {
  types: string[]
  field?: string
  resolution?: dateResolution
  order?: 'desc' | 'asc'
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

export const dateAggregationQuery = ({
  types = [],
  field = 'dateCreated',
  resolution = 'month',
  order = 'desc',
}: DateAggregationInput) => {
  const intervalMap = {
    year: {
      interval: '1y',
      format: 'y',
    },
    month: {
      interval: '1M',
      format: 'y-M',
    },
    week: {
      interval: '1w',
      format: 'y-w',
    },
    day: {
      interval: '1d',
      format: 'y-M-d',
    },
  }
  const query = {
    query: {
      bool: {
        filter: {
          terms: {
            type: types,
          },
        },
      },
    },
    aggs: {
      dates: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        date_histogram: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          calendar_interval: intervalMap[resolution].interval,
          format: intervalMap[resolution].format,
          order: { _key: order },
          // eslint-disable-next-line @typescript-eslint/camelcase
          min_doc_count: 1,
          field,
        },
      },
    },
  }

  return query
}
