import gql from 'graphql-tag'

export const typeDefs = gql`
  extend type Query {
    listNotifications: [Notification!]
    # listDocuments: [Document!]
    listLicenses: [License!]
    License(id: ID!): License
    # Document(id: ID!): Document
    Notification(id: ID!): Notification
  }

  # type Document {
  #   id: ID!
  #   date: DateTime!
  #   subject: String!
  #   senderName: String!
  #   senderNatReg: String!
  #   opened: Boolean!
  #   fileType: String!
  #   url: String!
  #   content: String
  # }

  type NotificationAction {
    id: ID!
    text: String!
    link: String!
  }

  type Notification {
    id: ID!
    serviceProvider: String!
    date: DateTime!
    title: String!
    message: String
    actions: [NotificationAction!]!
    link: String
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
    id: ID!
    type: LicenseType!
    serviceProvider: String!
    title: String!
  }
`
