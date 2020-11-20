import { TagAggregationInput } from '../types'

export const aggregationQuery = (tagType: string, size = 20) => ({
  aggs: {
    group: {
      nested: {
        path: 'tags',
      },
      aggs: {
        filtered: {
          filter: {
            term: {
              'tags.type': tagType, // we only count tags of this value and return the keys and values
            },
          },
          aggs: {
            count: {
              terms: {
                field: 'tags.key', // get key of this tag
                size, // we limit the aggregation to X values (fits our current usecase)
              },
              aggs: {
                value: {
                  terms: {
                    field: 'tags.value.keyword', // get value of this tag
                    size: 1, // we only need the one value
                  },
                },
              },
            },
          },
        },
      },
    },
  },
})

export const tagAggregationQuery = ({
  documentTypes,
  tagType,
  size,
}: TagAggregationInput) => {
  const query = {
    query: {
      bool: {
        filter: {
          terms: {
            type: documentTypes,
          },
        },
      },
    },
    ...aggregationQuery(tagType, size),
  }

  return query
}
