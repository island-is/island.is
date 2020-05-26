import { gql } from 'apollo-server-express'

export default gql`
  type Application {
    id: String
  }

  extend type Query {
    application: Application
  }
`
