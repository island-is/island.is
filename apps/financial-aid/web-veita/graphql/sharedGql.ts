import { gql } from '@apollo/client'

export const GetApplicationQuery = gql`
  query GetApplicationQuery {
    applications {
      id
      nationalId
      name
      phoneNumber
      email
    }
  }
`

