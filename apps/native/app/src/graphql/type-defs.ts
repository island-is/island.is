import gql from "graphql-tag";

export const typeDefs = gql`
  extend type Query {
    listDocuments: [Document!]
    listLicenses: [License!]
  }
  type Document {
    id: String
    title: String
    subtitle: String
  }
  type License {
    id: String
    title: String
    subtitle: String
  }

`;
