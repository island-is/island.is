import gql from 'graphql-tag'

export const GET_SEARCH_RESULTS_QUERY = gql`
  query GetSearchResults($query: SearcherInput!) {
    searchResults(query: $query) {
      total
      items {
        ... on Article {
          __typename
          title
          category {
            slug
            title
            description
          }
          group {
            title
            slug
            description
          }
        }

        ... on LifeEventPage {
          id
          title
          slug
          intro
          image {
            id
          }
          body
        }
      }
    }
  }
`

export const GET_SEARCH_AUTOCOMPLETE_TERM_QUERY = gql`
  query AutocompleteTermResults($input: WebSearchAutocompleteInput!) {
    webSearchAutocomplete(input: $input) {
      completions
    }
  }
`

export const GET_SEARCH_RESULTS_QUERY_DETAILED = gql`
  query GetSearchResultsDetailed($query: SearcherInput!) {
    searchResults(query: $query) {
      total
      items {
        ... on Article {
          __typename
          id
          contentStatus
          title
          slug
          content
          category {
            slug
            title
          }
          organization {
            id
            title
            description
            slug
          }
          relatedArticles {
            title
            slug
          }
          subArticles {
            title
            slug
          }
        }

        ... on LifeEventPage {
          id
          title
          slug
          intro
          image {
            id
            url
            title
            contentType
            width
            height
          }
          thumbnail {
            id
            url
            title
            contentType
            width
            height
          }
          body
        }
      }
    }
  }
`
