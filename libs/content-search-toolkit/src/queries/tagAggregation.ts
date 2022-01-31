import { TagAggregationInput } from '../types'

export const tagAggregationQueryFragment = (tagType: string, size = 20) => ({
  aggs: {
    group: {
      nested: {
        path: 'tags',
      },
      aggs: {
        filtered: {
          filter: {
            terms: {
              ['tags.type']: ['category', 'processentry'],
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
  console.log('tagType', tagType)
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
    ...tagAggregationQueryFragment('category', size),
    ...tagAggregationQueryFragment('processentry', size),
  }

  return query
}
