import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  type Article {
    id: String!
    title: String!
    content: String
  }

  input GetArticleInput {
    id: String
  }

  type Namespace {
    namespace: String!
    fields: String!
  }

  input GetNamespaceInput {
    namespace: String
  }

  extend type Query {
    getArticle(input: GetArticleInput): Article!
    getNamespace(input: GetNamespaceInput): Namespace!
  }
`

export default typeDefs

// TODO: Map content types to graphql
// TODO: Generate types for use in API and frontent
// TODO: Setup mock service for API
