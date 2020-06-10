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
    language: Language
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

  input ItemInput {
    _id: ID
    slug: String
    type: ItemType
    language: Language
  }

  input CategoriesInput {
    language: Language
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

  enum ItemType {
    article
    category
  }

  extend type Query {
    getSearchResults(query: SearcherInput): SearchResult!
    getSingleItem(input: ItemInput): ContentItem
    getCategories(input: CategoriesInput): [ContentCategory]
  }
`

export default typeDefs
