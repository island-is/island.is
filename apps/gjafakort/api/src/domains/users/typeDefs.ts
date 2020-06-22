import { gql } from 'apollo-server-express'

export default gql`
  type GiftCard {
    giftCardId: Int!
    amount: Int!
    applicationId: String
  }

  type GiftCardCode {
    code: String!
    expiryDate: String!
    pollingUrl: String!
  }

  type UserApplication {
    id: String!
    mobileNumber: String!
    countryCode: String!
    logs: [ApplicationLog]
  }

  type CreateUserApplication {
    application: UserApplication
  }

  input CreateUserApplicationInput {
    mobile: StringTrimmed
  }

  extend type Query {
    giftCardCode(giftCardId: Int!): GiftCardCode
    giftCards: [GiftCard]
    userApplication: UserApplication
    userApplicationCount: Int
  }

  extend type Mutation {
    fetchUserApplication(ssn: String!): UserApplication
    createUserApplication(
      input: CreateUserApplicationInput
    ): CreateUserApplication
  }
`
