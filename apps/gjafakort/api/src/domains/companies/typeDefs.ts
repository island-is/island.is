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
    name: String
    email: String
    state: String!
    companySSN: String!
    serviceCategory: String
    generalEmail: String
    companyDisplayName: String
    companyName: String
    exhibition: Boolean
    operatingPermitForRestaurant: Boolean
    operatingPermitForVehicles: Boolean
    operationsTrouble: Boolean
    phoneNumber: String
    validLicenses: Boolean
    validPermit: Boolean
    webpage: String
    logs: [ApplicationLog]
  }

  input CreateCompanyApplicationInput {
    email: StringTrimmed!
    generalEmail: StringTrimmed!
    phoneNumber: StringTrimmed!
    operationsTrouble: Boolean!
    companySSN: StringTrimmed!
    name: StringTrimmed!
    serviceCategory: StringTrimmed!
    webpage: StringTrimmed!
    companyName: StringTrimmed!
    companyDisplayName: StringTrimmed!
    operatingPermitForRestaurant: Boolean!
    exhibition: Boolean!
    operatingPermitForVehicles: Boolean!
    validLicenses: Boolean!
    validPermit: Boolean!
  }

  input ApproveCompanyApplicationInput {
    id: String!
  }

  input RejectCompanyApplicationInput {
    id: String!
  }

  type CreateCompanyApplication {
    application: CompanyApplication
  }

  type ApproveCompanyApplication {
    application: CompanyApplication
  }

  type RejectCompanyApplication {
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
    approveCompanyApplication(
      input: ApproveCompanyApplicationInput!
    ): ApproveCompanyApplication
    rejectCompanyApplication(
      input: RejectCompanyApplicationInput!
    ): RejectCompanyApplication
  }
`
