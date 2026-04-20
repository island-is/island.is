import { gql } from '@apollo/client'

export const GET_ORGANIZATIONS = gql`
  query GetOrganizations {
    getOrganizations {
      items {
        id
        title
        logo {
          url
          title
        }
      }
    }
  }
`
