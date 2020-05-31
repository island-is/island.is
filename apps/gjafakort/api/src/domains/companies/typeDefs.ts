import { gql } from 'apollo-server-express'

export default gql`
  type Company {
    ssn: String!
    name: String!
    application: Application
  }

  type getCompanies {
    companies: [Company]
  }

  type getCompany {
    company: Company
  }

  extend type Query {
    getCompanies: getCompanies
    getCompany(ssn: String!): getCompany
  }
`
