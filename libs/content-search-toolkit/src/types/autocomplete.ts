export interface AutocompleteTermInput {
  singleTerm: string
  size: number
}

export interface AutocompleteTermResponse {
  suggest: {
    searchSuggester: [{ options: [{ text: string }] }]
  }
}
