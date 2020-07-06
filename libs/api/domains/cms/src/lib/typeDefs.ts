import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  type Taxonomy {
    title: String
    slug: String
    description: String!
  }

  type Image {
    url: String!
    title: String
    filename: String
    contentType: String
    width: Int
    height: Int
  }

  type Article {
    id: String!
    slug: String!
    title: String!
    content: String
    group: Taxonomy
    category: Taxonomy
  }

  input GetArticleInput {
    slug: String
    lang: String!
  }

  type News {
    id: String!
    slug: String!
    title: String!
    intro: String!
    image: Image
    date: String!
    content: String
  }

  input GetNewsInput {
    slug: String!
    lang: String
  }

  input GetNewsListInput {
    lang: String
    year: Int
    month: Int
    ascending: Boolean
    offset: Int
    limit: Int
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
    getNews(input: GetNewsInput!): News
    getNewsList(input: GetNewsListInput): [News!]!
    getNamespace(input: GetNamespaceInput): Namespace
  }
`

export default typeDefs
