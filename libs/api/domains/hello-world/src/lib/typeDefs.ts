import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  type HelloWorld {
    message: String!
  }

  input HelloWorldInput {
    name: String = "World"
  }

  extend type Query {
    helloWorld(input: HelloWorldInput): HelloWorld!
  }
`

export default typeDefs
