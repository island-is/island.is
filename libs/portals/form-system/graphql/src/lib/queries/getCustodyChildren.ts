import { gql } from '@apollo/client'

export const GET_CUSTODY_CHILDREN = gql`
  query GetCustodyChildren {
    formSystemCustodyChildren {
      nationalId
      fullName
    }
  }
`
