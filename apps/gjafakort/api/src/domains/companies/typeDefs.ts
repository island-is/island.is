import { gql } from 'apollo-server-express'

export default gql`
  type Company {
    ssn: String!
    name: String!
  }

  type getCompanies {
    companies: [Company]
  }

  extend type Query {
    getCompanies: getCompanies
  }
`
