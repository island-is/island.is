interface SearchInput {
  queryString: string
  size: number
  page: number
  types: string[]
}

export const searchQuery = ({
  queryString,
  size = 10,
  page = 1,
  types,
}: SearchInput) => {
  const should = []
  const must = []
  // eslint-disable-next-line @typescript-eslint/camelcase
  let minimum_should_match = 1

  should.push({
    // eslint-disable-next-line @typescript-eslint/camelcase
    simple_query_string: {
      query: queryString,
      fields: ['title^20', 'title.stemmed^10', 'content.stemmed^2'],
      // eslint-disable-next-line @typescript-eslint/camelcase
      analyze_wildcard: true,
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

  return {
    query: {
      bool: {
        should,
        must,
        // eslint-disable-next-line @typescript-eslint/camelcase
        minimum_should_match,
      },
    },
    size,
    from: (page - 1) * size, // if we have a page number add it as offset for pagination
  }
}
