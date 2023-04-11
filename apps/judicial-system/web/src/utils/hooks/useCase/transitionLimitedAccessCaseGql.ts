import { gql } from '@apollo/client'

export const TransitionLimitedAccessCaseMutation = gql`
  mutation TransitionLimitedAccessCaseMutation($input: TransitionCaseInput!) {
    transitionLimitedAccessCase(input: $input) {
      state
      appealState
    }
  }
`
