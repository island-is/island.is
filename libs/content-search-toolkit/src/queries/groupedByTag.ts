import { GroupedByTagSearchInput } from '../types'
import { searchQuery } from './search'

// Runs the default search query and groups the matching documents by the key of a given tag type.
// Each group contains its best matching documents and groups are sorted by their best score
export const groupedByTagSearchQuery = ({
  queryString,
  types,
  tagType,
  maxGroups = 100,
  documentsPerGroup = 5,
}: GroupedByTagSearchInput) => {
  const { query } = searchQuery({ queryString, types, size: 0 }, false)

  return {
    query,
    size: 0,
    aggs: {
      tags: {
        nested: { path: 'tags' },
        aggs: {
          filtered: {
            filter: { term: { 'tags.type': tagType } },
            aggs: {
              groups: {
                terms: {
                  field: 'tags.key',
                  size: maxGroups,
                  order: { 'documents>maxScore': 'desc' },
                },
                aggs: {
                  documents: {
                    reverse_nested: {},
                    aggs: {
                      maxScore: { max: { script: '_score' } },
                      topHits: {
                        top_hits: {
                          size: documentsPerGroup,
                          _source: ['response'],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  }
}
