import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  type SearchResult {
    _id: String
    title: String
    content: String
    tag: [String]
  }

  input SearcherInput {
    content: String
    title: String
    tag: String
  }

  input CategoryInput {
    id: ID,
    slug: String
  }

  type ContentCategory {
    _id: ID
    title: String
    slug: String
  }

  input ArticleInput {
    _id: ID
    title: String
    slug: String
    content: String
  }

  type ContentArticle {
    _id: ID
    title: String
    slug: String
  }

  extend type Query {
    search(query: SearcherInput): [SearchResult!]!
    category(input: CategoryInput): ContentCategory
    article(input: ArticleInput): [SearchResult!]!
  }
`

export default typeDefs
