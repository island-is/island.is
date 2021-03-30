import gql from 'graphql-tag'

export const typeDefs = gql`
  extend type Query {
    listDocuments: [Document!]
    listLicenses: [License!]
    License(id: ID!): License
    Document(id: ID!): Document
  }

  type Document {
    id: Id
    date: DateTime
    subject: String
    senderName: String
    senderNatReg: String
    opened: Boolean
    fileType: String
    url: String
    content: String
  }

  enum LicenseType {
    IDENTIDY_CARD
    PASSPORT
    DRIVERS_LICENSE
    WEAPON_LICENSE
    FISHING_CARD
    ADR_LICENSE
    MACHINE_CERTIFICATE
    CRIMINAL_RECORD_CERTIFICATE
    VACCINE_CERTIFICATE
  }

  type License {
    id: String
    type: LicenseType
    serviceProvider: String
    title: String
  }
`
