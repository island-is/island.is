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
        fuzzy: {
          unicode_aware: boolean
          fuzziness: string
        }
      }
    }
  }
}

export const autocompleteTerm = ({ prefix, size }: AutocompleteTermInput) => ({
  suggest: {
    searchSuggester: {
      prefix,
      completion: {
        field: 'term_pool',
        size,
        // eslint-disable-next-line @typescript-eslint/camelcase
        skip_duplicates: true,
        fuzzy: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          unicode_aware: true,
          fuzziness: 'auto',
        },
      },
    },
  },
})
