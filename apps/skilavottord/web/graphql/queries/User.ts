import gql from 'graphql-tag'

export const USER = gql`
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
