import { gql } from '@apollo/client'

export const GET_ORGANIZATIONS = gql`
  query FormSystemGetOrganizations {
    getOrganizations {
      items {
        id
        title
      }
    }
  }
`
