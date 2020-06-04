import { gql } from 'apollo-server-express'

export default gql`
  type FormStepOption {
    label: String!
    value: String!
  }

  type FormStepFollowup {
    id: String!
    answer: String!
    steps: [FormStep!]!
  }

  type FormStep {
    id: String!
    type: String!
    title: String!
    navigationTitle: String!
    description: String!
    options: [FormStepOption!]
    followups: [FormStepFollowup!]
  }

  type Form {
    id: String!
    title: String!
    description: String!
    steps: [FormStep!]!
    postFlowContent: String
  }

  extend type Query {
    form(lang: String!, id: String!): Form
  }
`
