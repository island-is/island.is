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
      term: {
        suggest_mode: 'always',
        field: 'title',
      },
    },
    contentSuggest: {
      term: {
        suggest_mode: 'always',
        field: 'content',
      },
    },
  },
})
