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
    content_phrase: {
      phrase: {
        field: 'content.trigram',
        size: 1,
        gram_size: 3,
        direct_generator: [
          {
            field: 'content.trigram',
            suggest_mode: 'always',
          },
        ],
        collate: {
          query: {
            source:{
              match: {
                '{{field_name}}': '{{suggestion}}',
              },
            }
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
