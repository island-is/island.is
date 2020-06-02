import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  type Searcher {
    message: String!
  }

  input SearcherInput {
    name: String = "World"
  }

  extend type Query {
    searcher(input: SearcherInput): Searcher!
  }
`

export default typeDefs
