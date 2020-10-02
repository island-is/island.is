import {
  AccessCategory,
  PricingCategory,
  DataCategory,
  TypeCategory,
} from '@island.is/api-catalogue/consts'

interface SearchInput {
  limit: number
  searchAfter?: string[]
  query?: string
  pricing?: PricingCategory[]
  data?: DataCategory[]
  type?: TypeCategory[]
  access?: AccessCategory[]
}

export const searchQuery = ({
  limit = 25,
  searchAfter = [],
  query,
  pricing = [],
  data = [],
  type = [],
  access = [],
}: SearchInput) => {
  const should = []
  //minimum_should_match makes sure that we match all available categories in the should part
  // eslint-disable-next-line @typescript-eslint/camelcase
  let minimum_should_match = 0

  if (pricing.length) {
    // eslint-disable-next-line @typescript-eslint/camelcase
    minimum_should_match++
    should.push({
      terms: {
        'pricing.keyword': pricing,
      },
    })
  }

  if (data.length) {
    // eslint-disable-next-line @typescript-eslint/camelcase
    minimum_should_match++
    should.push({
      terms: {
        'data.keyword': data,
      },
    })
  }

  if (type.length) {
    // eslint-disable-next-line @typescript-eslint/camelcase
    minimum_should_match++
    should.push({
      terms: {
        'type.keyword': type,
      },
    })
  }

  if (access.length) {
    // eslint-disable-next-line @typescript-eslint/camelcase
    minimum_should_match++
    should.push({
      terms: {
        'access.keyword': access,
      },
    })
  }

  const result = {
    query: {
      bool: {
        must: [
          {
            // eslint-disable-next-line @typescript-eslint/camelcase
            simple_query_string: {
              query: query + '*',
              fields: ['name', 'owner', 'description'],
              // eslint-disable-next-line @typescript-eslint/camelcase
              analyze_wildcard: true,
            },
          },
          {
            bool: {
              should,
              // eslint-disable-next-line @typescript-eslint/camelcase
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
