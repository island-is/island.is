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
  console.log(pricing)
  const should = []
  //minimum_should_match makes sure that we match all available categories in the should part
  let minimum_should_match = 0

  if (pricing.length) {
    minimum_should_match++
    should.push({
      terms: {
        'pricing.keyword': pricing,
      },
    })
  }

  if (data.length) {
    minimum_should_match++
    should.push({
      terms: {
        'data.keyword': data,
      },
    })
  }

  if (type.length) {
    minimum_should_match++
    should.push({
      terms: {
        'type.keyword': type,
      },
    })
  }

  if (access.length) {
    minimum_should_match++
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
              fields: ['name', 'owner', 'description'],
              analyze_wildcard: true,
            },
          },
          {
            bool: {
              should,
              minimum_should_match,
            },
          },
        ],
      },
    },
    sort: [
      { 'owner.keyword': { order: 'asc' } },
      { 'name.keyword': { order: 'asc' } },
    ],
    size: limit + 1, // if we have a page number add it as offset for pagination
  }

  if (searchAfter?.length) {
    result['search_after'] = searchAfter
  }

  return result
}
