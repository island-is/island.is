import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  type Article {
    id: String!
    title: String!
    content: String
  }

  input ArticleInput {
    id: String
  }

  extend type Query {
    article(input: ArticleInput): Article!
  }
`

export default typeDefs

// TODO: Map content types to graphql
// TODO: Generate types for use in API and frontent
// TODO: Setup mock service for API
