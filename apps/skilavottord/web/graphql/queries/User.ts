import gql from 'graphql-tag'

export const GET_USER = gql`
  query skilavottordUser {
    skilavottordUser {
      name
      nationalId
      mobile
      role
      partnerId
    }
  }
`
