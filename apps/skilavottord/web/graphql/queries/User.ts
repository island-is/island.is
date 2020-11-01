import gql from 'graphql-tag'

export const GET_USER = gql`
  query UserQuery {
    user {
      name
      nationalId
      mobile
    }
  }
`