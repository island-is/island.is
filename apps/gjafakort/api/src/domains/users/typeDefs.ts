import { gql } from 'apollo-server-express'

export default gql`
  type Greeting {
    greetingType: Int
    text: String
    contentUrl: String
  }

  type GiftDetail {
    packageId: String
    from: String
    greeting: Greeting
    personalMessage: String
  }

  type GiftCard {
    giftCardId: Int!
    amount: Float!
    applicationId: String
    giftDetail: GiftDetail
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
    verified: Boolean!
    logs: [ApplicationLog]
  }

  type GiveGift {
    success: Boolean!
  }

  type CreateUserApplication {
    application: UserApplication
  }

  input CreateUserApplicationInput {
    mobile: StringTrimmed
    confirmCode: StringTrimmed
  }

  type VerifyUserApplication {
    application: UserApplication
  }

  input VerifyUserApplicationInput {
    mobile: StringTrimmed
    confirmCode: StringTrimmed
  }

  type ConfirmMobile {
    mobile: String!
    success: Boolean!
  }

  input ConfirmMobileInput {
    mobile: StringTrimmed
  }

  input GiveGiftInput {
    giftCardId: Int!
    recipientMobileNumber: StringTrimmed!
    message: String
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
    giveGift(input: GiveGiftInput): GiveGift
    verifyUserApplication(
      input: VerifyUserApplicationInput
    ): VerifyUserApplication
    confirmMobile(input: ConfirmMobileInput): ConfirmMobile
  }
`
