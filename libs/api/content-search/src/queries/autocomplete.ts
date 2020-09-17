interface AutocompleteTermInput {
  prefix: string
  size: number
}

export interface AutocompleteTermResponse {
  suggest: {
    searchSuggester: [{ options: [{ text: string }] }]
  }
}

export const autocompleteTermQuery = ({
  prefix,
  size,
}: AutocompleteTermInput) => ({
  suggest: {
    searchSuggester: {
      prefix,
      completion: {
        field: 'termPool',
        size,
        // eslint-disable-next-line @typescript-eslint/camelcase
        skip_duplicates: true,
      },
    },
  },
})
