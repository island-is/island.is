import { SearchInput } from '../types'
import { tagAggregationQueryFragment } from './tagAggregation'
import { tagQuery } from './tagQuery'
import { typeAggregationQuery } from './typeAggregation'

export const searchQuery = ({
  queryString,
  size = 10,
  page = 1,
  types = [],
  tags = [],
  countTag = '',
  countTypes = false
}: SearchInput) => {
  const should = []
  const must = []
  // eslint-disable-next-line @typescript-eslint/camelcase
  let minimum_should_match = 1

  should.push({
    // eslint-disable-next-line @typescript-eslint/camelcase
    simple_query_string: {
      query: queryString,
      fields: ['title.stemmed^15', 'title.compound', 'content.stemmed^5'],
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

  let aggregation = { aggs: {} }

  if (countTag) {
    // set the tag aggregation as the only aggregation
    aggregation.aggs = tagAggregationQueryFragment(countTag).aggs
  }

  if (countTypes) {
    // add tag aggregation, handle if there is already an existing aggregation
    aggregation.aggs = { ...aggregation.aggs, ...typeAggregationQuery().aggs }
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
