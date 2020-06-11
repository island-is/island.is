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
  }

  type Log {
    id: String!
    state: String!
    title: String!
    data: String
    authorSSN: String
  }

  type ApplicationWithLogs {
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
    logs: [Log]
  }

  input CreateApplicationInput {
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

  type CreateApplication {
    application: Application
  }

  extend type Query {
    applications: [ApplicationWithLogs]
  }

  extend type Mutation {
    createApplication(input: CreateApplicationInput!): CreateApplication
  }
`
