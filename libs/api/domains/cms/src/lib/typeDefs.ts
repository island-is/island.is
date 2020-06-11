import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  type Article {
    id: String!
    slug: String!
    title: String!
    content: String
  }

  input GetArticleInput {
    slug: String
    lang: String!
  }

  type Namespace {
    namespace: String!
    fields: String!
  }

  input GetNamespaceInput {
    namespace: String
    lang: String!
  }

  extend type Query {
    getArticle(input: GetArticleInput): Article
    getNamespace(input: GetNamespaceInput): Namespace
  }
`

export default typeDefs

// TODO: Map content types to graphql
// TODO: Generate types for use in API and frontent
// TODO: Setup mock service for API
