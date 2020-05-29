import { gql } from 'apollo-server-express'

export default gql`
  type Company {
    ssn: String!
    name: String!
  }

  type getCompaniesPayload {
    companies: [Company]
  }

  extend type Query {
    getCompanies: getCompaniesPayload
  }
`
