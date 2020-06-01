import { gql } from 'apollo-server-express'

export default gql`
  type Company {
    ssn: String!
    name: String!
    application: Application
  }

  extend type Query {
    companies: [Company]
    company(ssn: String!): Company
  }
`
