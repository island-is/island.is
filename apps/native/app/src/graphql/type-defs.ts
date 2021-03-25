import gql from "graphql-tag";

export const typeDefs = gql`
  extend type Query {
    listDocuments: [Document!]
    listLicenses: [License!]
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
  }
  type License {
    id: String
    title: String
    subtitle: String
  }

`;
