import gql from 'graphql-tag'

export const GET_SEARCH_RESULTS_QUERY = gql`
  query GetSearchResults($query: SearcherInput!) {
    searchResults(query: $query) {
      total
      items {
        id
        title
        content
        slug
        category
        group
      }
    }
  }
`

export const GET_SEARCH_RESULTS_QUERY_DETAILED = gql`
  query GetSearchResultsDetailed($query: SearcherInput!) {
    searchResults(query: $query) {
      total
      items {
        id
        title
        slug
        tag
        content
        categoryDescription
        categorySlug
        category
        group
        groupSlug
        contentType
      }
    }
  }
`
