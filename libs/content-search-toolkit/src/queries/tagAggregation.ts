import { TagAggregationInput } from '../types'

export const tagAggregationQueryFragment = (tagTypes: string[], size = 20) => ({
  aggs: {
    group: {
      nested: {
        path: 'tags',
      },
      aggs: {
        filtered: {
          filter: {
            terms: {
              ['tags.type']: tagTypes,
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
                type: {
                  terms: {
                    field: 'tags.type',
                    size: 1,
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
  tagTypes,
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
    ...tagAggregationQueryFragment(tagTypes, size),
  }

  return query
}
