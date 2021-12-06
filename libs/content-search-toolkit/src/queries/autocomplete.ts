import { AutocompleteTermInput } from '../types'

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
