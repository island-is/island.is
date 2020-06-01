import { gql } from 'apollo-server-express'

export default gql`
  type Application {
    id: String
    name: String!
    email: String!
    state: String!
    companySSN: String!
    serviceCategory: String
    generalEmail: String!
    webpage: String!
    phoneNumber: String!
    approveTerms: Boolean
    companyName: String
    companyDisplayName: String
  }

  input CreateApplicationInput {
    email: String!
    generalEmail: String!
    phoneNumber: String!
    approveTerms: Boolean!
    ssn: String!
    name: String!
    serviceCategory: String!
    webpage: String!
    companyName: String!
    companyDisplayName: String!
    acknowledgedMuseum: Boolean!
    exhibition: Boolean!
    followingLaws: Boolean!
    operatingPermitForVehicles: Boolean!
    validLicenses: Boolean!
    validPermit: Boolean!
  }

  type createApplication {
    application: Application
  }

  extend type Mutation {
    createApplication(input: CreateApplicationInput!): createApplication
  }
`
