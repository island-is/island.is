import { title } from 'process'
import { AutocompleteTermInput, SuggestionsQueryInput } from '../types'

export const autocompleteTermQuery = ({
  singleTerm,
  size,
}: AutocompleteTermInput) => ({
  suggest: {
    searchSuggester: {
      prefix: singleTerm,
      completion: {
        field: 'termPool',
        size,
        skip_duplicates: true,
      },
    },
  },
})

export const suggestionsQuery = ({ searchQuery }: SuggestionsQueryInput) => ({
  suggest: {
    text: searchQuery,
    titleSuggest: {
      phrase: {
        field: 'title.trigram',
        gram_size: 1,
        max_errors: 2,
        size: 15,
        direct_generator: [
          {
            field: 'title.trigram',
            suggest_mode: 'always',
          },
        ],
        collate: {
          query: {
            source: {
              match: {
                '{{field_name}}': {
                  query: '{{suggestion}}',
                  operator: 'and',
                },
              },
            },
          },
          params: {
            field_name: 'title',
          },
          prune: true,
        },
      },
    },
    contentSuggest: {
      phrase: {
        field: 'content.trigram',
        gram_size: 1,
        max_errors: 2,
        size: 15,
        direct_generator: [
          {
            field: 'content.trigram',
            suggest_mode: 'always',
          },
        ],
        collate: {
          query: {
            source: {
              match: {
                '{{field_name}}': {
                  query: '{{suggestion}}',
                  operator: 'and',
                },
              },
            },
          },
          params: {
            field_name: 'content',
          },
          prune: true,
        },
      },
    },
  },
})
