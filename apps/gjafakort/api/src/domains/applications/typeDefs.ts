import { gql } from 'apollo-server-express'

export default gql`
  type Application {
    id: String!
    companySSN: String!
    name: String!
    companyDisplayName: String!
    serviceCategory: String!
    email: String!
    generalEmail: String!
    phoneNumber: String!
    approveTerms: Boolean!
    companyDisplayName: String!
    state: String!
  }

  extend type Query {
    getApplication(companySSN: String!): getApplicationPayload
  }

  type getApplicationPayload {
    application: Application
  }

  input createApplicationInput {
    company {
      ssn: String!
      name: String!
      displayName: String!
      serviceCategory: String!
    }
    email: String!
    generalEmail: String!
    phoneNumber: String!
    approveTerms: Boolean!
  }

  type createApplicationPayload {
    application: Application
  }

  extend type Mutation {
    createApplication(input: createApplicationInput!): createApplicationPayload
  }
`
