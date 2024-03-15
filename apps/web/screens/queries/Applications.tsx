import gql from 'graphql-tag'

export const GET_APPLICATIONS_QUERY = gql`
  query GetApplications($query: SearcherInput!) {
    searchResults(query: $query) {
      total
      items {
        ... on Article {
          id
          title
          slug
          category {
            id
            slug
            title
          }
          organization {
            id
            title
            description
            slug
            logo {
              id
              url
              title
            }
          }
        }
      }
      tagCounts {
        key
        value
        count
      }
      typesCount {
        key
        count
      }
      processEntryCount
    }
  }
`
