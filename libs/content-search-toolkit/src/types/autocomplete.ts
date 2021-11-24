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

export interface AutocompleteSearchQueryInput {
  searchQuery: string
}

export interface AutocompleteSearchQueryResponse {
  suggest: {
    titleSuggest: [SuggestResponse]
    contentSuggest: [SuggestResponse]
  }
}
