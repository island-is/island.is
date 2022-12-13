import { DateAggregationInput } from '../types'
import { TagQuery, tagQuery } from './tagQuery'

export const dateAggregationQuery = ({
  types = [],
  field = 'dateCreated',
  resolution = 'month',
  order = 'desc',
  tags = [],
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
  const tagFilters: TagQuery[] = []

  if (tags.length) {
    tags.forEach((tag) => {
      tagFilters.push(tagQuery(tag))
    })
  }

  const query = {
    query: {
      bool: {
        filter: [
          {
            terms: {
              type: types,
            },
          },
          ...tagFilters,
        ],
      },
    },
    aggs: {
      dates: {
        date_histogram: {
          calendar_interval: intervalMap[resolution].interval,
          format: intervalMap[resolution].format,
          order: { _key: order },
          min_doc_count: 1,
          field,
        },
      },
    },
  }

  return query
}
