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
