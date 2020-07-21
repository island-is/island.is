import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  type Taxonomy {
    title: String
    slug: String
    description: String!
  }

  type Image {
    url: String!
    title: String!
    contentType: String!
    width: Int!
    height: Int!
  }

  type Pagination {
    page: Int!
    perPage: Int!
    totalResults: Int!
    totalPages: Int!
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

  type News {
    id: String!
    slug: String!
    title: String!
    intro: String!
    image: Image
    date: String!
    content: String
  }

  type PaginatedNews {
    page: Pagination!
    news: [News!]!
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
    page: Int
    perPage: Int
  }

  type Timeline {
    id: ID!
    title: String!
    date: String!
    numerator: Int
    denominator: Int
    label: String!
    body: String
    tags: [String]!
    link: String!
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
    getNewsList(input: GetNewsListInput): PaginatedNews!
    getNamespace(input: GetNamespaceInput): Namespace
    getTimeline: [Timeline!]!
  }
`

export default typeDefs
