import { SearchInput } from '../types'
import { tagAggregationQueryFragment } from './tagAggregation'
import { TagQuery, tagQuery } from './tagQuery'
import { typeAggregationQuery } from './typeAggregation'
import { processAggregationQuery } from './processAggregation'

const getBoostForType = (type: string, defaultBoost: string | number = 1) => {
  // normalising all types before boosting
  return defaultBoost
}

export const searchQuery = (
  {
    queryString,
    size = 10,
    page = 1,
    types = [],
    tags = [],
    excludedTags = [],
    contentfulTags = [],
    countTag = [],
    countTypes = false,
    countProcessEntry = false,
  }: SearchInput,
  aggregate = true,
  highlightSection = false,
) => {
  const should = []
  const must: TagQuery[] = []
  const mustNot: TagQuery[] = []
  let minimumShouldMatch = 1

  const fieldsWeights = [
    'title^6', // note boosting ..
    'title.stemmed^2', // note boosting ..
    'content',
    'content.stemmed',
  ]
  // * wildcard support for internal clients
  if (queryString.trim() === '*') {
    should.push({
      simple_query_string: {
        query: queryString,
        fields: fieldsWeights,
        analyze_wildcard: true,
        default_operator: 'and',
      },
    })
  } else {
    should.push({
      multi_match: {
        fields: fieldsWeights,
        query: queryString,
        fuzziness: 'AUTO',
        operator: 'and',
        type: 'best_fields',
      },
    })
  }

  // if we have types restrict the query to those types
  if (types?.length) {
    minimumShouldMatch++ // now we have to match at least one type and the search query

    types.forEach((type) => {
      const [value, boost = 1] = type.split('^')
      should.push({
        term: {
          type: {
            value,
            boost: getBoostForType(value, boost),
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

  if (excludedTags?.length) {
    excludedTags.forEach((tag) => {
      mustNot.push(tagQuery(tag))
    })
  }

  if (contentfulTags?.length) {
    contentfulTags
      .map((ct) => ({ key: ct, type: 'contentfultag' }))
      .forEach((tag) => {
        must.push(tagQuery(tag))
      })
  }

  const aggregation = { aggs: {} }

  if (aggregate) {
    if (countTag) {
      // set the tag aggregation as the only aggregation
      aggregation.aggs = tagAggregationQueryFragment(countTag).aggs
    }

    if (countTypes) {
      // add tag aggregation, handle if there is already an existing aggregation
      aggregation.aggs = { ...aggregation.aggs, ...typeAggregationQuery().aggs }
    }

    if (countProcessEntry) {
      aggregation.aggs = {
        ...aggregation.aggs,
        ...processAggregationQuery().aggs,
      }
    }
  }

  const highlight = {
    highlight: {
      pre_tags: ['<b>'],
      post_tags: ['</b>'],
      number_of_fragments: 3,
      fragment_size: 150,
      fields: {
        title: {},
        content: {},
      },
    },
  }

  return {
    query: {
      function_score: {
        query: {
          bool: {
            should,
            must,
            must_not: mustNot,
            minimum_should_match: minimumShouldMatch,
          },
        },
        functions: [
          // content gets a natural boost based on visits/popularity
          {
            field_value_factor: {
              field: 'popularityScore',
              factor: 1.2,
              modifier: 'log1p',
              missing: 1,
            },
          },
          // content that is an entrance to "umsoknir" gets a boost
          { filter: { range: { processEntryCount: { gte: 1 } } }, weight: 2 },
          // content that is a "forsíða stofnunar" gets a boost
          { filter: { term: { type: 'webOrganizationPage' } }, weight: 3 },
          // reduce news weight
          { filter: { term: { type: 'webNews' } }, weight: 0.5 },
        ],
      },
    },
    ...(Object.keys(aggregation.aggs).length ? aggregation : {}), // spread aggregations if we have any
    ...(highlightSection ? highlight : {}),
    size,
    from: (page - 1) * size, // if we have a page number add it as offset for pagination
  }
}
