import { gql } from 'apollo-server-express'

export default gql`
  type AuthUser {
    ssn: String!
    name: String!
    mobile: String
  }

  extend type Query {
    user: AuthUser
  }
`
