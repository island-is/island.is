import { gql } from '@apollo/client'

export const ProsecutorSectionUsersQuery = gql`
  query ProsecutorSectionUsersQuery {
    users {
      id
      created
      modified
      name
      nationalId
      mobileNumber
      role
      title
      email
      institution {
        id
        type
        name
      }
      active
    }
  }
`
