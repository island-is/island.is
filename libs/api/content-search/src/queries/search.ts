import { Tag } from '../dto/searcher.input'

import { tagQuery } from './documentByMetaData'

interface SearchInput {
  queryString: string
  size: number
  page: number
  types: string[]
  tags: Tag[]
  countTag: string
}

const aggregationQuery = (tagType) => ({
  aggs: {
    groupBy: {
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
            groupByCount: {
              terms: {
                field: 'tags.key', // get key of this tag
                size: 20, // we limit the aggregation to X values (fits our current usecase)
              },
              aggs: {
                groupByValue: {
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

export const searchQuery = ({
  queryString,
  size = 10,
  page = 1,
  types,
  tags,
  countTag,
}: SearchInput) => {
  const should = []
  const must = []
  // eslint-disable-next-line @typescript-eslint/camelcase
  let minimum_should_match = 1

  should.push({
    // eslint-disable-next-line @typescript-eslint/camelcase
    simple_query_string: {
      query: queryString,
      fields: ['title.stemmed^20', 'title.compound^3', 'content.stemmed^10'],
      // eslint-disable-next-line @typescript-eslint/camelcase
      analyze_wildcard: true,
      // eslint-disable-next-line @typescript-eslint/camelcase
      default_operator: 'and',
    },
  })

  // if we have types restrict the query to those types
  if (types?.length) {
    // eslint-disable-next-line @typescript-eslint/camelcase
    minimum_should_match++ // now we have to match at least one type and the search query

    types.forEach((type) => {
      const [value, boost = 1] = type.split('^')
      should.push({
        term: {
          type: {
            value,
            boost,
          },
        },
      })
    })
  }

  if (tags?.length) {
    tags.forEach((tag) => {
      must.push(tagQuery(tag))
    })
  }

  let aggregation = {}
  if (countTag) {
    aggregation = aggregationQuery(countTag)
  }

  return {
    query: {
      bool: {
        should,
        must,
        // eslint-disable-next-line @typescript-eslint/camelcase
        minimum_should_match,
      },
    },
    ...aggregation,
    size,
    from: (page - 1) * size, // if we have a page number add it as offset for pagination
  }
}
