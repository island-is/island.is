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
  }

  type CreateUserApplication {
    application: UserApplication
  }

  input CreateUserApplicationInput {
    mobile: String
  }

  extend type Query {
    giftCardCode(giftCardId: Int!, mobile: String!): GiftCardCode
    giftCards(mobile: String!): [GiftCard]
    userApplication: UserApplication
  }

  extend type Mutation {
    createUserApplication(
      input: CreateUserApplicationInput
    ): CreateUserApplication
  }
`
