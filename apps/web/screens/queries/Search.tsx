import gql from 'graphql-tag'

export const GET_SEARCH_RESULTS_QUERY = gql`
  query GetSearchResults($query: SearcherInput!) {
    getSearchResults(query: $query) {
      total
      items {
        title
        content
        slug
        category_slug
      }
    }
  }
`
