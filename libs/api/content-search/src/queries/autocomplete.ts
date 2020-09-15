interface AutocompleteTermInput {
  prefix: string
  size: number
}

export interface AutocompleteTermResponse {
  suggest: {
    searchSuggester: [{ options: [{ text: string }] }]
  }
}

export interface AutocompleteTermRequestBody {
  suggest: {
    searchSuggester: {
      prefix: string
      completion: {
        field: string
        size: number
        skip_duplicates: boolean
      }
    }
  }
}

export const autocompleteTermQuery = ({ prefix, size }: AutocompleteTermInput): AutocompleteTermRequestBody => ({
  suggest: {
    searchSuggester: {
      prefix,
      completion: {
        field: 'termPool',
        size,
        // eslint-disable-next-line @typescript-eslint/camelcase
        skip_duplicates: true
      },
    },
  },
})
