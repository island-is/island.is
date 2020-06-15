import { gql } from 'apollo-server-express'

export default gql`
  type UserApplication {
    id: String!
    mobileNumber: String!
    countryCode: String!
  }

  type CreateUserApplication {
    application: UserApplication
  }

  input CreateUserApplicationInput {
    mobile: String
  }

  extend type Query {
    userApplication: UserApplication
  }

  extend type Mutation {
    createUserApplication(
      input: CreateUserApplicationInput
    ): CreateUserApplication
  }
`
