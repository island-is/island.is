interface SearchInput {
  limit: number
  searchAfter?: string[]
  query?: string
  pricing?: string[]
  data?: string[]
  type?: string[]
  access?: string[]
}

export const searchQuery = ({
  limit,
  searchAfter = [],
  query = '',
  pricing = [],
  data = [],
  type = [],
  access = [],
}: SearchInput) => {
  const should = []
  //minimumShouldMatch makes sure that we match all available categories in the should part
  let minimumShouldMatch = 0

  if (pricing.length) {
    minimumShouldMatch++
    should.push({
      terms: {
        'pricing.keyword': pricing,
      },
    })
  }

  if (data.length) {
    minimumShouldMatch++
    should.push({
      terms: {
        'data.keyword': data,
      },
    })
  }

  if (type.length) {
    minimumShouldMatch++
    should.push({
      terms: {
        'type.keyword': type,
      },
    })
  }

  if (access.length) {
    minimumShouldMatch++
    should.push({
      terms: {
        'access.keyword': access,
      },
    })
  }

  const result: any = {
    query: {
      bool: {
        must: [
          {
            simple_query_string: {
              query: query + '*',
              fields: ['title', 'owner', 'description'],
              analyze_wildcard: true,
            },
          },
          {
            bool: {
              should,
              minimum_should_match: minimumShouldMatch,
            },
          },
        ],
      },
    },
    sort: [
      { 'owner.keyword': { order: 'asc' } },
      { 'title.keyword': { order: 'asc' } },
    ],
    size: limit + 1, // if we have a page number add it as offset for pagination
  }

  if (searchAfter?.length) {
    result['search_after'] = searchAfter
  }

  return result
}
