import { logger } from '@island.is/logging'

interface SearchInput {
  queryString: string
  size: number
  page: number
  types: string[]
}

export interface SearchRequestBody {
  query: {
    bool: {
      should: any[] // Type this?
      must: any[] // Type this?
    }
  }
  size: number
  from: number
}

export const searchQuery = ({
  queryString,
  size = 10,
  page = 1,
  types,
}: SearchInput): SearchRequestBody => {
  const should = []
  const must = []
  let minimum_should_match = 1
  should.push({
    simple_query_string: {
      query: `*${queryString}*`,
      fields: ['title.stemmed^10', 'content.stemmed^2'],
      analyze_wildcard: true,
    },
  })

  // if we have types restrict the query to those types
  if (types?.length) {
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

  const query = {
    query: {
      bool: {
        should,
        must,
        minimum_should_match,
      },
    },
    size,
    from: (page - 1) * size, // if we have a page number add it as offset for pagination
  }

  return query
}
