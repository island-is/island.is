import { AutocompleteTermInput, AutocompleteSearchQueryInput } from '../types'

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

export const autocompleteSearchQuery = ({
  searchQuery
}: AutocompleteSearchQueryInput) => ({
  suggest: {
    text: searchQuery,
    titleSuggest: {
      term : {
        suggest_mode: "always",
        field: "title"
      }
    },
    contentSuggest: {
      term : {
        suggest_mode: "always",
        field: "title"
      }
    }
  }
})