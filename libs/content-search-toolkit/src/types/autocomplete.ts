export interface SuggestResponse {
  text: string
  options: [
    {
      text: string
      score: number
    },
  ]
}
export interface AutocompleteTermInput {
  singleTerm: string
  size: number
}

export interface AutocompleteTermResponse {
  suggest: {
    searchSuggester: [{ options: [{ text: string }] }]
  }
}

export interface SuggestionsQueryInput {
  searchQuery: string
}

export interface SuggestionsQueryResponse {
  suggest: {
    titleSuggest: [SuggestResponse]
    contentSuggest: [SuggestResponse]
  }
}
