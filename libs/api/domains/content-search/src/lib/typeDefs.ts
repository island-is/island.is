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

  extend type Query {
    searcher(query: SearcherInput): [SearchResult!]!
  }
`

export default typeDefs
