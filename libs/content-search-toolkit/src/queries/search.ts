import { SearchInput } from '../types'
import { tagAggregationQueryFragment } from './tagAggregation'
import { TagQuery, tagQuery } from './tagQuery'
import { typeAggregationQuery } from './typeAggregation'
import { processAggregationQuery } from './processAggregation'

const getBoostForType = (type: string, defaultBoost: string | number = 1) => {
  // normalizing all types before boosting
  return defaultBoost
}

export const searchQuery = (
  {
    queryString,
    size = 10,
    page = 1,
    sort = [],
    types = [],
    tags = [],
    excludedTags = [],
    contentfulTags = [],
    countTag = [],
    countTypes = false,
    countProcessEntry = false,
    useQuery,
  }: SearchInput,
  aggregate = true,
  highlightSection = false,
) => {
  const should = []
  const must: TagQuery[] = []
  const mustNot: TagQuery[] = []
  let minimumShouldMatch = 1

  // Handle aliases since the search engine has not been configured to support organization aliases
  if (queryString.trim().toLowerCase() === 'tr') {
    queryString = 'Tryggingastofnun'
  } else if (queryString.trim().toLowerCase() === 'vmst') {
    queryString = 'Vinnumálastofnun'
  }

  // * wildcard support for internal clients - eg. used by island.is app
  if (queryString.trim() === '*') {
    should.push({
      simple_query_string: {
        query: queryString,
        analyze_wildcard: true,
        default_operator: 'and',
      },
    })
  } else {
    switch (useQuery) {
      // the search logic used for search drop down suggestions
      // term and prefix queries on content title
      case 'suggestions':
        if (queryString.split(' ').length > 1) {
          should.push({
            multi_match: {
              query: queryString + '*',
              fields: ['title'],

              fuzziness: 1,
              operator: 'and',
              type: 'best_fields',
            },
          })
        } else {
          should.push({
            bool: {
              should: [
                { prefix: { title: queryString } },
                {
                  fuzzy: {
                    title: {
                      value: queryString,
                      fuzziness: 1,
                      prefix_length: 0,
                    },
                  },
                },
              ],
            },
          })
        }

        break

      // the search logic used for general site search
      // uses all analyzed fields
      case 'default':
      default:
        should.push({
          multi_match: {
            fields: [
              'title^100', // note boosting ..
              'content',
            ],
            query: queryString,
            fuzziness: 1,
            operator: 'and',
            type: 'best_fields',
          },
        })
        should.push({
          nested: {
            path: 'tags',
            query: {
              bool: {
                must: [
                  { term: { 'tags.type': 'keyword' } },
                  { match: { 'tags.value': queryString } },
                ],
              },
            },
          },
        })
        break
    }
  }

  // if we have types restrict the query to those types
  if (types?.length) {
    minimumShouldMatch++ // now we have to match at least one type and the search query
    should.push({
      terms: {
        type: types.map((type) => {
          const [value, boost = 1] = type.split('^')
          return {
            value,
            boost: getBoostForType(value, boost),
          }
        }),
      },
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
      number_of_fragments: 1,
      fragment_size: 150,
      order: 'score',
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
    sort,
    from: (page - 1) * size, // if we have a page number add it as offset for pagination
  }
}
