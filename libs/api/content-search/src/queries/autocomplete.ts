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
      prefix: string,
      completion: {
        field: string,
        size: number,
        skip_duplicates: boolean,
        fuzzy: {
          unicode_aware: boolean,
          fuzziness: string,
        },
      },
    },
  }
}

export const autocompleteTerm = ({ prefix, size }: AutocompleteTermInput) => ({
  suggest: {
    searchSuggester: {
      prefix,
      completion: {
        field: 'term_pool',
        size,
        skip_duplicates: true,
        fuzzy: {
          unicode_aware: true,
          fuzziness: 'auto',
        },
      },
    },
  },
})
