import { gql } from '@apollo/client'

export const SelectProsecutorUsersQuery = gql`
  query SelectProsecutorUsersQuery {
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
