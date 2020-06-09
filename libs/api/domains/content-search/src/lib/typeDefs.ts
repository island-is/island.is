import { gql } from 'apollo-server-express'

export const typeDefs = gql`
    type ContentItem {
    _id: String
    title: String
    content: String
    tag: [String]
    category: String
    content_blob: String
    content_id: String
    content_type: String
    date: String
    image: String
    imageText: String
    lang: String
    slug: String
  }

  type SearchResult {
    total: Int
    items: [ContentItem!]
  }

  input SearcherInput {
    queryString: String
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

  enum Language {
    is
    en
  }

  extend type Query {
    getSearchResults(query: SearcherInput, language: Language): SearchResult!
    category(input: CategoryInput): ContentCategory
    article(input: ArticleInput): ContentItem
  }
`

export default typeDefs
