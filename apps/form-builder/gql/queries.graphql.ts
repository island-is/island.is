import { gql } from '@apollo/client'

export const ADD_STEP = gql`
  mutation AddStep($input: AddStepInput!) {
    addStep(input: $input) {
      id
      name {
        is
        en
      }
      type
    }
  }
`
