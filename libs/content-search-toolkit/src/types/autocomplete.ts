import { double } from "aws-sdk/clients/lightsail";

 export interface SuggestResponse {
  text: string,
  options: [
    {
      text: string,
      score: double,
    }
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
    titleSuggest: [SuggestResponse],
    contentSuggest: [SuggestResponse]
  }
}