import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  type ContentItem {
    id: ID
    title: String
    content: String
    tag: [String]
    category: String
    categorySlug: String
    contentBlob: String
    contentId: String
    contentType: String
    date: String
    image: String
    imageText: String
    lang: String
    slug: String
  }

  type SearchResult {
    total: Int
    items: [ContentItem!]!
  }

  input SearcherInput {
    queryString: String
    language: ContentLanguage
    size: Int
    page: Int
  }

  input CategoryInput {
    id: ID
    slug: String
  }

  type ContentCategory {
    title: String
    slug: String
  }

  input ItemInput {
    id: ID
    slug: String
    type: ItemType
    language: ContentLanguage
  }

  input CategoriesInput {
    language: ContentLanguage
  }

  input ArticlesInCategoryInput {
    slug: String
    language: ContentLanguage
  }

  type ContentArticle {
    id: ID
    title: String
    slug: String
  }

  enum ContentLanguage {
    is
    en
  }

  enum ItemType {
    article
    category
  }

  extend type Query {
    searchResults(query: SearcherInput): SearchResult!
    singleItem(input: ItemInput): ContentItem
    categories(input: CategoriesInput): [ContentCategory]
    articlesInCategory(category: ArticlesInCategoryInput): [ContentItem]
  }
`

export default typeDefs
