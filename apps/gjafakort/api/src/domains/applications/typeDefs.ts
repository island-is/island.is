import { gql } from 'apollo-server-express'

export default gql`
  type Application {
    id: String!
    email: String!
    state: String!
  }

  extend type Query {
    getApplication(ssn: String!): getApplicationPayload
  }

  type getApplicationPayload {
    application: Application
  }

  input createApplicationInput {
    ssn: String!
    email: String!
  }

  type createApplicationPayload {
    application: Application
  }

  extend type Mutation {
    createApplication(input: createApplicationInput!): createApplicationPayload
  }
`
