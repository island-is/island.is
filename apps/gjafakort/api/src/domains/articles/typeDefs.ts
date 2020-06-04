import { gql } from 'apollo-server-express'

export default gql`
  type ArticleCta {
    label: String!
    url: String!
  }

  type Article {
    id: String!
    title: String!
    description: String!
    cta: ArticleCta
    content: String!
  }

  extend type Query {
    article(lang: String!, id: String!): Article
  }
`
