import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  type Taxonomy {
    title: String
    slug: String
    description: String!
  }

  type Article {
    id: String!
    slug: String!
    title: String!
    content: String
    group: Taxonomy
    category: Taxonomy!
  }

  input GetArticleInput {
    slug: String
    lang: String!
  }

  type Namespace {
    namespace: String
    fields: String
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
