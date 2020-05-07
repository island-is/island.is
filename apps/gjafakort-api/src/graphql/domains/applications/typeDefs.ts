import { gql } from 'apollo-server-express'

export default gql`
  type Application {
    id: String!
  }

  extend type Query {
    getApplication: Application
  }
`
