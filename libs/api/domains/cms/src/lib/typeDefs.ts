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

  type Link {
    text: String!
    url: String!
  }

  type TimelineEvent {
    id: ID!
    title: String!
    date: String!
    numerator: Int
    denominator: Int
    label: String!
    body: String
    tags: [String!]!
    link: String!
  }

  type TimelineSlice {
    id: ID!
    title: String!
    events: [TimelineEvent!]!
  }

  type Story {
    label: String!
    title: String!
    logo: Image!
    readMoreText: String!
    date: String!
    intro: String!
    body: String
  }

  type StorySlice {
    id: ID!
    readMoreText: String!
    stories: [Story!]!
  }

  type HeadingSlice {
    id: ID!
    title: String!
    body: String!
  }

  type LatestNewsSlice {
    id: ID!
    title: String!
    news: [News!]!
  }

  type MailingListSignupSlice {
    id: ID!
    title: String!
    description: String!
    inputLabel: String!
    buttonText: String!
  }

  type LinkCard {
    title: String!
    body: String!
    link: String!
    linkText: String!
  }

  type LinkCardSlice {
    id: ID!
    title: String!
    cards: [LinkCard!]!
  }

  type LogoListSlice {
    id: ID!
    title: String!
    body: String!
    images: [Image!]!
  }

  type PageHeaderSlice {
    id: ID!
    title: String!
    introduction: String!
    navigationText: String!
    links: [Link!]!
    slices: [Slice!]!
  }

  type IconBullet {
    id: ID!
    title: String!
    body: String!
    icon: Image!
    url: String
    linkText: String
  }

  type NumberBullet {
    id: ID!
    title: String!
    body: String!
  }

  type NumberBulletGroup {
    id: ID!
    defaultVisible: Int!
    bullets: [NumberBullet!]!
  }

  union BulletEntry = IconBullet | NumberBulletGroup

  type BulletListSlice {
    id: ID!
    bullets: [BulletEntry!]!
  }

  union Slice =
      PageHeaderSlice
    | TimelineSlice
    | HeadingSlice
    | StorySlice
    | LinkCardSlice
    | LatestNewsSlice
    | MailingListSignupSlice
    | LogoListSlice
    | BulletListSlice

  input GetPageInput {
    slug: String!
    lang: String!
  }

  type Page {
    title: String!
    slug: String!
    seoDescription: String!
    theme: String!
    slices: [Slice!]!
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
    getPage(input: GetPageInput!): Page
  }
`

export default typeDefs
