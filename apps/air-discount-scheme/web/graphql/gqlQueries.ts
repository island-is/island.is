import { gql } from '@apollo/client'

export const CurrentUserQuery = gql`
  query CurrentUserQuery {
    user {
      nationalId
      name
      mobile
      role
    }
  }
`
