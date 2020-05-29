import { gql } from 'apollo-server-express'

export default gql`
  type Company {
    ssn: String!
    name: String!
  }

  extend type Query {
    companies: [Company]
  }
`
