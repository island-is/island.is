import { gql } from '@apollo/client'

export const CurrentUserQuery = gql`
  query CurrentUser {
    currentUser {
      id
      created
      modified
      active
      name
      title
      role
      email
      mobileNumber
      nationalId
      institution {
        id
        created
        modified
        name
        type
        policeCaseNumberPrefix
        active
      }
    }
  }
`
