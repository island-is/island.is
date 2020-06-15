import { gql } from 'apollo-server-express'

export default gql`
  type Company {
    ssn: String!
    name: String!
    application: CompanyApplication
  }

  type ApplicationLog {
    id: String!
    state: String!
    title: String!
    data: String
    authorSSN: String
  }

  type CompanyApplication {
    id: String
    name: String!
    email: String!
    state: String!
    companySSN: String!
    serviceCategory: String
    generalEmail: String!
    companyDisplayName: String
    companyName: String
    exhibition: Boolean
    operatingPermitForRestaurant: Boolean
    operatingPermitForVehicles: Boolean
    operationsTrouble: Boolean
    phoneNumber: String!
    validLicenses: Boolean
    validPermit: Boolean
    webpage: String!
    logs: [ApplicationLog]
  }

  input CreateCompanyApplicationInput {
    email: String!
    generalEmail: String!
    phoneNumber: String!
    operationsTrouble: Boolean!
    companySSN: String!
    name: String!
    serviceCategory: String!
    webpage: String!
    companyName: String!
    companyDisplayName: String!
    operatingPermitForRestaurant: Boolean!
    exhibition: Boolean!
    operatingPermitForVehicles: Boolean!
    validLicenses: Boolean!
    validPermit: Boolean!
  }

  type CreateCompanyApplication {
    application: CompanyApplication
  }

  extend type Query {
    companyApplications: [CompanyApplication]
    companies: [Company]
    company(ssn: String!): Company
  }

  extend type Mutation {
    createCompanyApplication(
      input: CreateCompanyApplicationInput!
    ): CreateCompanyApplication
  }
`
