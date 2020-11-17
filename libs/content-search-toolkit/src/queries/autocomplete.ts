import { AutocompleteTermInput } from '../types';

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
        // eslint-disable-next-line @typescript-eslint/camelcase
        skip_duplicates: true,
      },
    },
  },
})
