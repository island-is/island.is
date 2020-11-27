import { TypeAggregationInput } from '../types'

export const typeAggregationQuery = ({
  size = 20,
}: TypeAggregationInput = {}) => {
  const query = {
    aggs: {
      typeCount: {
        terms: {
          field: 'type',
          size,
        },
      },
    },
  }

  return query
}
